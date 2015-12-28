/**
 * @file <%= moduleDescription %>
 * @author <%= userName %>
 * @module <%= moduleName %>
**/
(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([<%= depList %>], function(<% if (use.jquery) { %>$<% } %><% if (use.jquery && depList.length > 1) { %>, <% } %><% if (use.underscore) { %>_<% } %><% if (use.backbone) { %>, Backbone<% } %>) {
            return (root.<%= moduleName %> = factory(root<% if (use.jquery) { %>, $<% } %><% if (use.underscore) { %>, _<% } %><% if (use.backbone) { %>, Backbone<% } %>));
        });
    } else if (typeof exports === 'object') {<% if (use.jquery) { %>
        var $ = require('jquery');<% } %><%     if (use.underscore) { %>
        var _ = require('underscore');<% } %><% if (use.backbone) { %>
        var Backbone = require('backbone');<% } %>
        module.exports = factory(root<% if(use.jquery) { %>, $<% } %><% if(use.underscore) { %>, _<% } %><% if(use.backbone) { %>, Backbone<% } %>);
    } else {
        root.<%= moduleName %> = factory(root<% if (use.jquery) { %>, jQuery<% } %><% if (use.underscore) { %>, underscore<% } %><% if (use.backbone) { %>, Backbone<% } %>);
    }
}(this, function(root<% if (use.jquery) { %>, $<% } %><% if (use.underscore) { %>, _<% } %><% if (use.backbone) { %>, Backbone<% } %>) {
    'use strict';

    //Write constructors, functions, objects, variables, and other stuff here...
    function <%= moduleName %>() {
        this._foo = 'bar';
    }

    <%= moduleName %>.prototype.foo = function() {
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
