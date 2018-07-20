var socket = io ({
  transports: ['websocket'], 
  upgrade: false
});

let btnJoin = document.getElementById('join_room')
let btnSend = document.getElementById('send_message')

// DOM listeners
btnJoin.addEventListener('click', (e) => {
  let room = document.getElementById('room').value
  let name = document.getElementById('name').value
  if (name !== '' && room !== '') {
    socket.emit('room.join', {room, name});
    document.getElementById('disconnected').classList.add('hide')
    document.getElementById('connected').classList.remove('hide')
  }
  else {
    M.toast({html:'you must enter a username and channel to connect'})
  }
});

btnSend.addEventListener('click', (e) => {
  let msg = document.getElementById('message')
  if (msg.value !== '') {
    socket.emit('message.send', {
      name: document.getElementById('name').value,
      room: document.getElementById('room').value,
      message: msg.value
    })
    msg.value = ''    
  }
})

let addLi = (message) => {
  console.log(message)
  console.log(name)
  let li = document.createElement('li');
  li.appendChild(document.createTextNode(message));
  document.getElementById('list').appendChild(li);
};

// socket listeners
socket.on('join', addLi);
socket.on('message.send', addLi)