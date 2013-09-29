var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    port    = process.env.PORT || 80,
    http    = require('http'),
    server  = http.createServer(app);
    io      = require('socket.io').listen(server);

io.configure(function() {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/server'));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.use(app.router);
});

io.sockets.on('connection', function (socket) {

  socket.AGssid = new Date().getTime(); // First collision = champaign bottle
  socket.broadcast.emit('newClient', {ssid:socket.AGssid} );

  socket.on('clientMoved', function (data) {
    socket.broadcast.emit('clientMoved', {
      ssid: socket.AGssid,
      x:data.x,
      y:data.y,
      z:data.z
    });
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('clientQuit', {
      ssid: socket.AGssid
    });
  });

  socket.on('clientMessage', function (data) {
    socket.broadcast.emit('clientMessage', data);
  });

  socket.on('clientChangeColor', function (data) {
    socket.broadcast.emit('clientChangeColor', {
      ssid: socket.AGssid,
      R:data.R,
      G:data.G,
      B:data.B,
      A:data.A
    });
  });

});


server.listen(port);