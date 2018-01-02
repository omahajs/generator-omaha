/**
 * WebSocket Server
 * @see {@link https://github.com/websockets/ws}
**/
'use strict';

const config   = require('config');
const {Server} = require('ws');

const wss = new Server({
    app: require(`${__dirname }/server`),
    port: config.get('websocket').port
});

wss.broadcast = data => {
    wss.clients.forEach(client => {
        client.send(data);
    });
};
wss.on('connection', socket => {
    console.log(`${wss.clients.length } client(s) connected.`);
    socket.on('message', message => {
        console.log('received: %s', message);
        socket.send(message);
    });
});

module.exports = wss;
