var config    = require('config');
var log       = require('npmlog');
// Handle error conditions
process.on('SIGTERM', function() {
    log.warn('exit', 'Exited on SIGTERM');
    process.exit(0);
});
process.on('SIGINT', function() {
    log.warn('exit', 'Exited on SIGINT');
    process.exit(0);
});
process.on('uncaughtException', function(err) {
    log.error('uncaughtException ', err);
    process.exit(1);
});
/**
 * Static HTTP Server
 **/
var app = require('./web/server');
app.listen(config.get('http').port);
/**
 * WebSocket Server Endpoint
**/
var wss = require('./web/socket.js');

log.info('HTTP server started.', 'Listening on port %j', config.get('http').port);
log.info('WebSocket server started.', 'Listening on port %j', config.get('websocket').port);