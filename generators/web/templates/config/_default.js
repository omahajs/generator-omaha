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
        port: <%= websocketPort %>
    },
    http: {
        port: process.env.PORT || <%= httpPort %>
    },
    log: {
        level: "error"
    },
    csp: {
        'default-src': '\'self\'',
        'script-src':  '\'self\' cdnjs.cloudflare.com'
    }
};
