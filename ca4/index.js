const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('users');

const app = express();
const server =  http.createServer(app);
const io = socketio(server);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
const adName = 'Admin';

// Start when a client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

  // Welcome current user to chat
  socket.emit('message', formatMessage(adName, 'Welcome to the chat.'));

  // Broadcast to chat when a user connects
  socket.broadcast.to(user.room).emit('message', formatMessage(adName, `${user.username} has joined the chat`));

  // Send users and room info
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });
});

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io.to(user.room).emit('message', formatMessage(adName, `${user.username} has left the chat`));

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
    
  });  

});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));





