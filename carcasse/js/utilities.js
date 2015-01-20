"use strict";

/*
* Base view: common operations for all views (template base rendering, dynamic loading of templates, sub-views)
*/
app.utilities.BaseView = Backbone.View.extend({

   initialize: function () {
       this._views = {};
       this._dfd = $.Deferred();
       this._dfd.resolve(this);
   },

   /*
    * Template management
    */

   prefix: app.config.root + '/tpl/',
   template: '',

   getTemplate: function () {
       var path = this.prefix + this.template + '.html',
           dfd = $.Deferred();
       app.templates = app.templates || {};

       if (app.templates[path]) {
           dfd.resolve(app.templates[path]);
       } else {
           $.get(path, function (data) {
               app.templates[path] = _.template(data, null, {variable: 'data'});
               dfd.resolve(app.templates[path]);
           }, "text");
       }

       return dfd.promise();
   },

   /*
    * Sub-view management
    */

   getViews: function (selector) {
       if (selector in this._views) {
           return this._views[selector];
       }
       return [];
   },

   insertView: function (selector, view) {
       if (!view) {
           view = selector;
           selector = '';
       }
       // Keep a reference to this selector/view pair
       if (!(selector in this._views)) {
           this._views[selector] = [];
       }
       this._views[selector].push(view);
       // Forget this subview when it gets removed
       view.once('remove', function (view) {
           var i, found = false;
           for (i = 0; i < this.length; i++) {
               if (this[i].cid === view.cid) {
                   found = true;
                   break;
               }
           }
           if (found) {
               this.splice(i, 1);
           }
       }, this._views[selector]);
   },

   removeViews: function (selector) {
       if (selector in this._views) {
           while (this._views[selector].length) {
               this._views[selector][0].remove();
           }
       }
   },

   // Take care of sub-views before removing
   remove: function () {
       _.each(this._views, function (viewList, selector) {
           _.each(viewList, function (view) {
               view.remove();
           });
       });
       this.trigger('remove', this);
       Backbone.View.prototype.remove.apply(this, arguments);
   },

   /*
    * Rendering process
    */

   serialize: function () {
       return this.model.toJSON();
   },

   // Can be overridden by child classes
   beforeRender: function () {},
   afterRender: function () {},

   render: function () {
       // Reset promise
       this._dfd = $.Deferred();

       // Give a chance to child classes to do something before render
       this.beforeRender();

       this.getTemplate().done(_.bind(function (tpl) {

           var data = this.serialize(),
               rawHtml = tpl(data),
               rendered,
               subViewsDfd = [];

           // Re-use nice "noel" trick from LayoutManager
           rendered = this.$el.html(rawHtml).children();
           this.$el.replaceWith(rendered);
           this.setElement(rendered);

           // Add sub-views
           _.each(this._views, function (viewList, selector) {
               var context = _.pick(this, 'BaseView', 'dfds');
               context.base = selector ? this.$el.find(selector) : this.$el;
               _.each(viewList, function (view) {
                   view.render();
                   view.$el.appendTo(this.base);
                   if (view instanceof this.BaseView) {
                       // Sub-view inherit from BaseView, we can safely assume an asynchronous behaviour and a promise method
                       this.dfds.push(view.promise());
                   }
               }, context);
           }, {$el: this.$el, BaseView: this.constructor, dfds: subViewsDfd});

           // Give a chance to child classes to do something after render
           $.when.apply($, subViewsDfd).done(_.bind(function() {
               try {
                   this.afterRender();
                   this._dfd.resolve(this);
               } catch (e) {
                   if (console && console.error) {
                       console.error(e);
                   }
                   this._dfd.reject(this);
               }
           }, this)).fail(_.bind(function () {
               this._dfd.reject(this);
           }, this));

       }, this)).fail(_.bind(function (tpl) {
           this._dfd.reject(this);
       }, this));

       return this;
   },

   promise: function () {
       return this._dfd.promise();
   }
});




