/**
 * @file < Short description of plugin purpose and function >
 * @author <%= userName %>
 * @exports <%= pluginName %>
**/
(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([<%= depList %>], function(<%= defineArguments %>) {
            return (root.<%= pluginName %> = factory(<%= iifeArguments %>));
        });
    } else if (typeof exports === 'object') {
        <%= requireStatements %>
        module.exports = factory(<%= iifeArguments %>);
    } else {
        root.<%= pluginName %> = factory(<%= iifeArguments %>);
    }
}(this, function(<%= iifeArguments %>) {
    'use strict';

    //Write constructors, functions, objects, variables, and other stuff here...
    function <%= pluginName %>() {
        this._foo = 'bar';
    }

    <%= pluginName %>.prototype.foo = function() {
        console.log(this._foo);
    }

    function privateFunction() {
        console.log('"Well begun is half done"');
        console.info('--Aristotle');
    }

    return {
        //Return the public module API here..
        publicFunction: privateFunction
    };
}));
