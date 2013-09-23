var express = require("express"),
    fs      = require('fs'),
    app     = express(),
    port    = process.env.PORT || 80,
    index;

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

app.listen(port);