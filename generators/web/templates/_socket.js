/**
 * WebSocket Server
 * @see {@link https://github.com/websockets/ws}
**/
var config  = require('config');
var log     = require('npmlog');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    app: require(__dirname + '/server'),
    port: config.get('websocket').port
});
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
wss.on('connection', function(ws) {
    console.log(wss.clients.length + ' client(s) connected.');
    ws.on('message', function(message) {
        console.log('received: %s', message);
        ws.send(message);
    });
});
module.exports = wss;