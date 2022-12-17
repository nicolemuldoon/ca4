const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('messages');
const { userJoin, getCurrentUser, userLeave } = require('users'); 

// App setup

const app = express();
const server =  http.createServer(app);
const io = socketio(server);

// Static folders
app.use(express.static(path.join(__dirname, 'public')));
const adName = 'Administator';

// When a client joins 
io.on('connection', function (socket) {

  socket.on('joinChat', ({ username }) => {
     const user = userJoin(socket.id, username);

  
  //Broadcast to user when they join chat
  socket.emit('message', formatMessage(adName, 'Welcome to the chat!'));

  // Broadcast to chat when a new user joins
  socket.broadcast.emit('message', formatMessage(adName, `${user.username} has joined the chat!`));

});

  // Listen for chat message
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.emit('message', formatMessage(user.username, msg));
  })

  // When a client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io.emit('message', formatMessage(adName, `${user.username} has left the chat!`));

  }
    
  });

});

const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));






