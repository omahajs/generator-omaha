/**
 * @file Mixins that extend Underscore
 * @author Jason Wohlgemuth
 */
define(function(require) {
    'use strict';

    var _ = require('underscore');

    _.mixin({
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        }
    });
});