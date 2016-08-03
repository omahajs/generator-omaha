'use strict';
var uuid = require('node-uuid');

module.exports = {
    execMap: {
        py: 'python',
        rb: 'ruby'
    },
    session: {
        name: 'customSessionId',
        secret: 'Quidquid latine dictum, altum videtur',
        genid: function(req) {return uuid.v1();},
        resave: false,
        saveUninitialized: false,
        cookie: {httpOnly: true, secure: true}
    },
    websocket: {
        port: <%= websocketPort %>
    },
    http: {
        port: process.env.PORT || <%= httpPort %>
    },
    https: {
        port: <%= httpsPort %>
    },
    log: {
        level: 'error'
    },
    csp: {
        'default-src': '\'self\'',
        'script-src':  '\'self\' cdnjs.cloudflare.com',
        'font-src': '\'self\' fonts.gstatic.com data:'
    }
};
