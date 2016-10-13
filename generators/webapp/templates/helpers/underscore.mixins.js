/**
 * @file Mixins that extend Underscore
 * @author Jason Wohlgemuth
**/
define(function(require) {
    'use strict';

    var _ = require('underscore');

    _.mixin({
        zipObject: _.object,
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        },
        curry: function(func, numArgs) {
            numArgs = numArgs || func.length;
            function subCurry(prev) {
                return function(arg) {
                    var args = prev.concat(arg);
                    if (args.length < numArgs) {
                        return subCurry(args);
                    } else {
                        return func.apply(this, args);
                    }
                };
            }
            return subCurry([]);
        }
    });
});
