const websocket = require('ws');

const wss = new websocket.WebSocketServer({ port: 5000 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data, isBinary) {
    // 广播
    wss.clients.forEach(function each(client) {
      const { type } = JSON.parse(data.toString());

      /**
       * 排除自身
       * 但 closeAll 放行
       */
      if (client === ws && !['closeAll'].includes(type)) return;

      if (client.readyState === websocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
