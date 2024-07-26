import { Server, OPEN } from 'ws';
const PORT = process.env.PORT || 8080;
const server = new Server({ port: PORT });

server.on('connection', socket => {
  console.log('Client connected');

  socket.on('message', message => {
    const data = JSON.parse(message);
    server.clients.forEach(client => {
      if (client !== socket && client.readyState === OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on port ${PORT}`);
