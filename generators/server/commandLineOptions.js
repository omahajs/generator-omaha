const { http, https, ws, graphql } = require('./ports');
module.exports = {
    defaults: {
        type: Boolean,
        desc: 'Scaffold server with defaults settings and no user interaction',
        defaults: false
    },
    http: {
        type: String,
        desc: 'HTTP server port',
        defaults: http
    },
    https: {
        type: String,
        desc: 'HTTPS server port',
        defaults: https
    },
    ws: {
        type: String,
        desc: 'WebSocket server port',
        defaults: ws
    },
    graphql: {
        type: String,
        desc: 'GraphQL server port',
        defaults: graphql
    }
};