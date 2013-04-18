"use strict";

// Creating the application namespace
var app = {
  config: {
    // Find pathname portion of the URL and clean it (remove trailing slash if any)
    root: window.location.pathname.replace(/\/(?:index.html)?$/, '')
  },
  dao: {},
  models: {},
  views: {},
  utils: {}
};


// ----------------------------------------------- The Application initialisation ------------------------------------------ //
$().ready(function() {
  init();
}) ;

function init(){

  window.deferreds = [];
     
  $.when.apply(null, deferreds).done(function() {
    app.app = new app.Router();
    Backbone.history.start();
  });
}

