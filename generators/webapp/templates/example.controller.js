/**
 * @file Example controller module using Marionette
 * @author <%= userName %>
 * @module controllers/example
**/<% if (moduleFormat === 'amd') { %>
define(function(require, exports, module) {
<% } %>
    'use strict';

    const Mn = require('backbone.marionette');

    const ExampleController = Mn.Object.extend({
        //controller code goes here
    });

    module.exports = ExampleController;<% if (moduleFormat === 'amd') { %>
});<% } %>
