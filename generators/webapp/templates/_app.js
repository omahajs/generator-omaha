/**
 * @file Application Core
 * @author <%= userName %>
 * @version 1.0.0
 * @license MIT
 * @module app
 * @exports app
**/<% if (moduleFormat === 'amd') { %>
define(function(require, exports, module) {
<% } %>
    'use strict';

    const Mn      = require('backbone.marionette');
    const logging = require('./plugins/radio.logging');
    const state   = require('./plugins/redux.state');

    require('./shims/mn.morphdom.renderer.shim');<% if (useHandlebars) { %>
    require('./helpers/handlebars.helpers');<% } %>
    require('./helpers/jquery.extensions');

    const Application = Mn.Application.extend({
        region: 'body'
    });

    module.exports = Object.assign(new Application(),
        logging,
        state
    );<% if (moduleFormat === 'amd') { %>
});<% } %>
