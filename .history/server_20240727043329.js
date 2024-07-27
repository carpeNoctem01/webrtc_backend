const io = require('socket.io')(3001);

let users = 0;
let calls = 0;

io.on('connection', (socket) => {
  users++;
  io.emit('users', users);

  console.log('a user connected');
  
  socket.on('disconnect', () => {
    users--;
    io.emit('users', users);
    console.log('user disconnected');
  });

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
    calls--;
    io.emit('calls', calls);
  });
});

console.log('Server listening on port 3001');
