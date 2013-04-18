"use strict";

// Creating the application namespace
var app = {
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

