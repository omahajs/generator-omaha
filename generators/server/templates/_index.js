var config = require('config');
var log    = require('npmlog');
var fs     = require('fs');
var https  = require('https');

var privateKey  = fs.readFileSync('web/ssl/server.key', 'utf8');
var certificate = fs.readFileSync('web/ssl/server.cert', 'utf8');
var credentials = {key: privateKey, cert: certificate};

/** Handle error conditions **/
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

/** Static HTTP Server **/
var app = require('./web/server');
app.listen(config.get('http').port);
/** Static HTTPS Server **/
https.createServer(credentials, app).listen(config.get('https').port);

/** WebSocket Server Endpoint **/
var wss = require('./web/socket.js');

log.info('HTTP server started........', 'Listening on port %j', config.get('http').port);
log.info('HTTPS server started.......', 'Listening on port %j', config.get('https').port);
log.info('WebSocket server started...', 'Listening on port %j', config.get('websocket').port);
