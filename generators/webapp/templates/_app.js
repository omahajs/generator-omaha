/**
 * @file Application Core
 * @author <%= userName %>
 * @version 1.0.0
 * @license MIT
 * @module app
 * @exports app
**/
define(function(require, exports, module) {
    'use strict';

    const Mn      = require('backbone.marionette');
    const logging = require('./plugins/radio.logging');
    const state   = require('./plugins/redux.state');

    require('./shims/mn.morphdom.renderer.shim');<% if (useHandlebars) { %>
    require('./helpers/handlebars.helpers');<% } %>
    require('./helpers/jquery.extensions');

    /**
     * @name Application
     * @constructor
     * @extends Marionette.Application
     * @prop {string} region='body'
    **/
    let Application = Mn.Application.extend({
        region: 'body'
    });

    module.exports = Object.assign(new Application(),
        logging,
        state
    );
});
