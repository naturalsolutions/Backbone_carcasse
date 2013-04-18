"use strict";

app.views.BaseView = Backbone.Layout.extend({
    prefix: app.config.root + '/tpl/',
    el: false, // LM will use template's root node

    fetch: function(path) {
        path += '.html';
        app.templates = app.templates || {};

        if (app.templates[path]) {
            return app.templates[path];
        }

        var done = this.async();

        $.get(path, function(contents) {
            done(app.templates[path] = _.template(contents));
        }, "text");
    },

    serialize: function() {
      if (this.model) return this.model.toJSON();
      return true;
    }
});


// -------------------------------------------------- The Views ---------------------------------------------------- //


