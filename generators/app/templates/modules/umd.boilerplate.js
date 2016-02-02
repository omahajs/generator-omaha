//Plugin name is "returnExports"
(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root.returnExports = factory(root));
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.returnExports = factory(root);
    }
}(this, function() {
    'use strict';
    return {};
}));