/**
 * @file Example model and collection module
 * @author <%= userName %>
 * @module models/example
 * @requires app
**/<% if (moduleFormat === 'amd') { %>
define(function(require, exports) {<% } %>
    'use strict';

    const Backbone = require('backbone');
    const WebApp   = require('app');

    const ExampleModel = Backbone.Model.extend({
        defaults: {
            name: WebApp.getState('name')
        }
    });
    const ExampleCollection = Backbone.Collection.extend({
        model: ExampleModel
    });

    exports.Model = ExampleModel;
    exports.Collection = ExampleCollection;<% if (moduleFormat === 'amd') { %>
});<% } %>
