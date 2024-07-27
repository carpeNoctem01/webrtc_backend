import { createServer } from 'http';
import socketIo from 'socket.io';

const server = createServer((req, res) => {
  res.writeHead(200);
  res.end('WebRTC Signaling Server');
});

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
