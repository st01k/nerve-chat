var socket = io ({
  transports: ['websocket'], 
  upgrade: false
});

document.getElementById('join_room').addEventListener('click', (e) => {
  socket.emit('room.join', document.getElementById('room').value);
});

document.getElementById('say_hello').addEventListener('click', (e) => {
  socket.emit('event', { 
    name: document.getElementById('name').value,
    room: document.getElementById('room').value});
});

document.getElementById('send_message').addEventListener('click', (e) => {
  socket.emit('message.send', {
    name: document.getElementById('name').value,
    room: document.getElementById('room').value,
    message: document.getElementById('message').value
  })
})

var addLi = (message) => {
  let li = document.createElement('li');
  li.appendChild(document.createTextNode(message));
  document.getElementById('list').appendChild(li);
};

socket.on('event', addLi);
socket.on('message.send', addLi)