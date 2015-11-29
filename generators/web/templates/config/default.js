'use strict';
var uuid = require('node-uuid');

module.exports = {
    execMap: {
        py: 'python',
        rb: 'ruby'
    },
    session: {
        secret: uuid.v1(),
        resave: false,
        saveUninitialized: false
    },
    websocket: {
        port: 13337
    },
    http: {
        port: process.env.PORT || 3000
    },
    log: {
        level: "error"
    },
    csp: {
        'default-src': '\'self\'',
        'script-src':  '\'self\' cdnjs.cloudflare.com'
    }
};
