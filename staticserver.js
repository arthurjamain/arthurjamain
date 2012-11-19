var express = require("express"),
    fs      = require('fs'),
    app     = express(),
    port    = 80,
    index;
    
app.get("/", function(req, res) {
    
    index = fs.readFileSync(__dirname + '/index.html');
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', index.length);
    
    res.end(index);
});

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname));
  app.use(express.errorHandler({
    dumpExceptions: true, 
    showStack: true
  }));
  app.use(app.router);
});

app.listen(port);