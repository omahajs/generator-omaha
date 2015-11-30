/**
 * @file Example model and collection module
 * @author <%= userName %>
 * @module models/Example
 */
define(function(require, exports) {
    'use strict';

    var Backbone  = require('backbone');
    var WebApp    = require('app');

    var ExampleModel = Backbone.Model.extend({
        defaults: {
            name: WebApp.model.get('name')
        }
    });
    var ExampleCollection = Backbone.Collection.extend({
        model: ExampleModel
    });
    exports.model      = ExampleModel;
    exports.collection = ExampleCollection;
});
