"use strict";

// ----------------------------------------------- The Application Router ------------------------------------------ //

app.Router = Backbone.Router.extend({
  
  routes: {
   
  },

  initialize: function() {

  },

  displayView : function (view) {
    if (this._currentView) {
        this._currentView.remove();
        this._currentView.off();
    }
    this._currentView = view;
    // Render is asynchronous with LayoutManager
    view.render().done(function(view) {
        $('#content').append(view.el);
    });
  },
 

});
