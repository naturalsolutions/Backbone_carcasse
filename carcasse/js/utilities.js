"use strict";


// -------------------------------------------------- Utilities ---------------------------------------------------- //

// The Template Loader. Used to asynchronously load templates located in separate .html files
app.utils.templateLoader = {
    templates: {},

    load: function(names) {
        //var deferreds = [], self = this;
        var self = this;
        $.each(names, function(index, name) {
            deferreds.push($.get('tpl/' + name + '.html', function(data) {
                console.log('load ' + name);
                self.templates[name] = data;
            }));
        });

        //$.when.apply(null, deferreds).done(callback);
    },

    // Get template by name from hash of preloaded templates
    get: function(name) {
        return this.templates[name];
    }

};

