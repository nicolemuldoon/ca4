const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll after message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get message
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Empty input form
    e.target.elements.msg.value  = '';
    e.target.elements.msg.focus();
});

// Output message to DOM 
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('msg');
    div.innerHTML = `<p class="name">${message.username} <span>${message.time}</span></p>
    <p class="reply">${message.text}</p>`;
    document.querySelector('.messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}














