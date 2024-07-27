import Fastify from 'fastify';
import { WebSocketServer } from 'ws';

const fastify = Fastify();
const PORT = 3000;

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(`WebSocket server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ port: PORT });

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
