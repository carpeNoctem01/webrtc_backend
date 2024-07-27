const WebSocket = require('ws');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    const data = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on port ${PORT}`);
