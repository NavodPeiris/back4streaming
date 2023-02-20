const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static('public'));

wss.on('connection', function connection(ws) {
  clients.push(ws);
  console.log('New client connected');

  ws.on('close', function () {
    clients = clients.filter(function (client) {
      return client !== ws;
    });
    console.log('Client disconnected');
  });
});

app.post('/', function (req, res) {
  let data = [];
  req.on('data', chunk => {
    data.push(chunk);
  });
  req.on('end', () => {
    const buf = Buffer.concat(data);
    clients.forEach(function (client) {
      client.send(buf);
    });
    res.send('OK');
  });
});

server.listen(3000, function () {
  console.log('Server started on port 3000');
});
