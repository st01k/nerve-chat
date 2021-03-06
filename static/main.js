var socket = io ({
  transports: ['websocket'], 
  upgrade: false
});

let btnJoin = document.getElementById('join_room')
let btnSend = document.getElementById('send_message')

// DOM listeners
btnJoin.addEventListener('click', joinRoom);

function joinRoom(e) {
  let room = document.getElementById('room').value
  let name = document.getElementById('name').value
  if (name !== '' && room !== '') {
    socket.emit('room.join', {room, name});
    btnJoin.classList.remove('blue')
    btnJoin.classList.add('green')
    btnJoin.innerText = 'change channel'
  }
  else {
    M.toast({html:'username and channel are required to connect'})
  }
}

btnSend.addEventListener('click', (e) => {
  let msg = document.getElementById('message')
  if (msg.value !== '') {
    let connected = !(document.getElementById('join_room').innerText == 'CONNECT')
    if (connected) {
      socket.emit('message.send', {
        name: document.getElementById('name').value,
        room: document.getElementById('room').value,
        message: msg.value
      })
      msg.value = ''    
    }
    else {
      M.toast({ html: 'you must be connected to a channel to chat'})
    }    
  }
})

let addLi = (data) => {
  let li = document.createElement('li');
  let template = `
    <small class="orange-text"> ${data.date}</small>
    <br>
    <span class=" blue-text bold">${data.name}:</span>
    <span>${data.msg}</span>
  `
  // let stamp = document.createElement('p')
  // stamp.innerText = data.date
  // stamp.classList.add('orange-text')
  // li.appendChild(stamp)

  // let name = document.createElement('span')
  // name.innerText = `${data.name}: `
  // name.classList.add('blue-text', 'bold')
  // li.appendChild(name)

  li.innerHTML = template;
  document.getElementById('list').appendChild(li);

  scroll()
};

let joined = (data) => {
  let li = document.createElement('li');
  li.classList.add('blue-grey-text')

  li.appendChild(document.createTextNode(data));
  document.getElementById('list').appendChild(li);

  scroll()
};

function scroll() {
  let el = document.getElementById("content");
  window.scrollTo(0, el.scrollHeight)
}

// socket listeners
socket.on('join', joined);
socket.on('message.send', addLi)