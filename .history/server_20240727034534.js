import Fastify from 'fastify';
import { WebSocketServer } from 'ws';

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 3000;
const users = new Map();

const start = async () => {
  try {
    const server = await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${server}`);

    const wss = new WebSocketServer({ server: fastify.server });

    wss.on('connection', (socket) => {
      const id = generateUniqueID();
      users.set(id, socket);
      console.log(`Client connected: ${id}`);
      sendUserList();

      socket.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
          case 'offer':
            if (users.has(data.to)) {
              users.get(data.to).send(JSON.stringify({ type: 'offer', sdp: data.sdp, from: id }));
            }
            break;
          case 'answer':
            if (users.has(data.to)) {
              users.get(data.to).send(JSON.stringify({ type: 'answer', sdp: data.sdp }));
            }
            break;
          case 'candidate':
            users.forEach((client) => {
              if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'candidate', candidate: data.candidate }));
              }
            });
            break;
        }
      });

      socket.on('close', () => {
        console.log(`Client disconnected: ${id}`);
        users.delete(id);
        sendUserList();
      });
    });

    function sendUserList() {
      const userList = Array.from(users.keys());
      users.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'user-list', users: userList }));
        }
      });
    }

    function generateUniqueID() {
      return Math.random().toString(36).substr(2, 9);
    }

    console.log(`WebSocket server is running on port ${PORT}`);

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
