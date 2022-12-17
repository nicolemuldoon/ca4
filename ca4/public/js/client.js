const chatBox = document.getElementById('chatBox')
const chatMessages = document.querySelector('.messages');

// Get username

const {username} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Enter chatroom
socket.emit('joinChat', { username });

// Server message
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scrolls chat down when a message is received
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Submit message
chatBox.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Aquire text of message
  const msg = e.target.elements.msg.value;

  // Send message to the server
  socket.emit('chatMessage', msg);

  //Clear input form
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output message to document
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('msg');
  div.innerHTML = `<p class="name">${message.username} <span>${message.time}</span></p>
  <p class="reply">${message.text}</p>`;
  document.querySelector('.messages').appendChild(div);
}


















