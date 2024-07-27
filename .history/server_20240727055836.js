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
  
  console.log('A user connected. Total users:', users);

  socket.on('offer', (offer) => {
    console.log('Received offer:', offer);
    calls++;
    io.emit('calls', calls);
    socket.broadcast.emit('offer', offer);
    console.log('Offer broadcasted. Total calls:', calls);
  });

  socket.on('answer', (answer) => {
    console.log('Received answer:', answer);
    socket.broadcast.emit('answer', answer);
    console.log('Answer broadcasted.');
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
    console.log('Candidate broadcasted.');
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
  });
});

server.listen(8080, () => {
  console.log('Listening on *:8080');
});
