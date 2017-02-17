'use strict';

module.exports = {
    jquery: {
        type: Boolean,
        desc: 'Add jQuery dependency',
        defaults: false
    },
    underscore: {
        type: Boolean,
        desc: 'Add Underscore dependency',
        defaults: false
    },
    lodash: {
        type: Boolean,
        desc: 'Add lodash dependency',
        defaults: false
    },
    ramda: {
        type: Boolean,
        desc: 'Add Ramda dependency',
        defaults: false
    },
    backbone: {
        type: Boolean,
        desc: 'Add Backbone dependency (automatically adds Underscore dependency)',
        defaults: false
    },
    marionette: {
        type: Boolean,
        desc: 'Add Marionette dependency (automatically adds Underscore and Backbone dependencies)',
        defaults: false
    },
    customDependency: {
        type: String,
        desc: 'Add custom dependency (value provided will be used as global dependency name)',
        defaults: ''
    },
    alias: {
        type: String,
        desc: 'Set custom variable name to be used in plugin scope for associated custom dependency',
        defaults: ''
    }
};
