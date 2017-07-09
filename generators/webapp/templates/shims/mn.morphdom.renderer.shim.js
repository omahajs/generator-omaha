define(function(require) {
    'use strict';

    const Mn       = require('backbone.marionette');
    const morphdom = require('morphdom');

    Mn.View.setRenderer(function(template, data) {
        let {el} = this;
        let node = el.cloneNode(false);// shallow clone
        node.innerHTML = template(data);
        morphdom(el, node);
    });
});
