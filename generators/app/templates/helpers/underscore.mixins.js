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
        },
        curry: function(func) {
            var applied = Array.prototype.slice.call(arguments, 1);
            return function() {
                var args = applied.concat(Array.prototype.slice.call(arguments));
                return func.apply(this, args);
            };
        }
    });
});
