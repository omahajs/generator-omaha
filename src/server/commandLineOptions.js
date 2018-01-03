const PORTS = require('./ports');
module.exports = {
    defaults: {
        type: Boolean,
        desc: 'Scaffold server with defaults settings and no user interaction',
        defaults: false
    },
    http: {
        type: String,
        desc: 'HTTP server port',
        defaults: PORTS.http
    },
    https: {
        type: String,
        desc: 'HTTPS server port',
        defaults: PORTS.https
    },
    ws: {
        type: String,
        desc: 'WebSocket server port',
        defaults: PORTS.ws
    },
    graphql: {
        type: String,
        desc: 'GraphQL server port',
        defaults: PORTS.graphql
    }
};
