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

    var Mn      = require('backbone.marionette');
    var logging = require('./plugins/radio.logging');
    var state   = require('./plugins/redux.state');

    require('./shims/marionette.radio.shim');<% if (useHandlebars) { %>
    require('./helpers/handlebars.helpers');<% } %>
    require('./helpers/jquery.extensions');

    /**
     * @class Application
     * @extends Marionette.Application
     * @prop {string} region='body'
    **/
    var Application = Mn.Application.extend({
        region: 'body'
    });

    module.exports = Object.assign(new Application(),
        logging,
        state
    );
});
