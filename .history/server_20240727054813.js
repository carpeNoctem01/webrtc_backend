import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer((req, res) => {
  res.writeHead(200);
  res.end('WebRTC Signaling Server');
});

const io = new Server(server);

let users = 0;
let calls = 0;

io.on('connection', (socket) => {
  users++;
  io.emit('users', users);
  io.emit('calls', calls);
  
  console.log('a user connected');

  socket.on('offer', (offer) => {
    calls++;
    io.emit('calls', calls);
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });

  socket.on('hangup', () => {
    if (calls > 0) {
      calls--;
    }
    io.emit('calls', calls);
  });

  socket.on('disconnect', () => {
    users--;
    io.emit('users', users);
    console.log('user disconnected');
  });
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});
