/**
 * @file Methods that extend jQuery
 * @author Jason Wohlgemuth
**/
define(function(require) {
    'use strict';

    var $ = require('jquery');

    $.fn.scrollbarWidth = function() {
        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);
        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = 'scroll';
        var inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        return widthNoScroll - widthWithScroll;
    };
    $.fn.setCursorPosition = function(pos) {
        this.each(function(index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };
    $.fn.extend({
        check: function() {
            return this.each(function() {
                this.checked = true;
            });
        },
        uncheck: function() {
            return this.each(function() {
                this.checked = false;
            });
        },
        events: function() {
            return $._data(this[0]).events;
        }
    });
});
