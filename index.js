const express = require('express'),
      socketio = require('socket.io'),
      process = require('process'),
      config = require('./config.js'),
      socketioRedis = require('socket.io-redis');

const app = express();
const server = app.listen(process.argv[2]);
const io = socketio(server);

app.use(express.static('static'));
// app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));

io.adapter(socketioRedis({host: config.redis_host, port: config.redis_port}));
io.on('connection', (socket) => {
  socket.on('room.join', (room) => {
    console.log(socket.rooms);
    Object.keys(socket.rooms).filter((r) => r != socket.id)
    .forEach((r) => socket.leave(r));

    setTimeout(() => {
      socket.join(room);
      socket.emit('event', 'Joined ' + room);
      socket.broadcast.to(room).emit('event', 'Someone joined room ' + room);
    }, 0);
  })

  socket.on('event', (e) => {
    socket.broadcast.to(e.room).emit('event', e.name + ' says hello!');
  });

  socket.on('message.send', (e) => {
    socket.emit('message.send', e.message)
    socket.broadcast.to(e.room).emit('message.send', e.name + ' says: ' + e.message)
  })
});
