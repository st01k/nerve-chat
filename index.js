const express = require('express'),
      socketio = require('socket.io'),
      process = require('process'),
      config = require('./config.js'),
      socketioRedis = require('socket.io-redis'),
      ip = require('ip')

const app = express(),
      port = 25922,
      host = ip.address()
      // server = app.listen(process.argv[2], host),

let prevIP;
app.use(function(req, res, next) {
        var currIP = req.ip;
        if (currIP != prevIP) {
                console.log('accessed from ' + req.ip);
                prevIP = currIP;
        }
        next();
});

app.use(express.static('static'));
// app.use('/materialize', express.static(__dirname + '/node_modules/materialize-css/dist/'));

const server = app.listen(port, host, () => {
        console.log(`http://${host}:${port}`)
      }),
      io = socketio(server)

      require("console-stamp")(console, {
        pattern : "dd/mm/yyyy HH:MM:ss.l",
        colors: {
                stamp: "yellow",
                label: "white"
        }
});

io.adapter(socketioRedis({host: config.redis_host, port: config.redis_port}));
io.on('connection', (socket) => {
  
  // join channel
  socket.on('room.join', (data) => {
    // console.log(socket.rooms);
    Object.keys(socket.rooms).filter((r) => r != socket.id)
    .forEach((r) => socket.leave(r));

    setTimeout(() => {
      socket.join(data.room);
      socket.emit('join', 'joined #' + data.room);
      socket.broadcast.to(data.room).emit('join', data.name + ' joined #' + data.room);
    }, 0);
  })

  // send message
  socket.on('message.send', (e) => {
    let date = new Date().toLocaleString()

    let data = {
      date,
      name: e.name,
      msg: e.message
    }

    let str = `[${date}] ${e.name}: ${e.message}`

    socket.emit('message.send', data)
    socket.broadcast.to(e.room).emit('message.send', data)
  })
});
