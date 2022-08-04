const websocket = require('ws');

const wss = new websocket.WebSocketServer({ port: 5000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data, isBinary) {
    // 广播
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
