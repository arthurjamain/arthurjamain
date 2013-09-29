define(['philogl'], function() {

  PhiloGL.unpack();

  var regMovFact = 0;
  var latMovFact = 0;
  var gravFact = 0;
  var jumpFact = 0;
  var colFact = 1;

  var oldMouseX = 0;
  var oldMouseY = 0;
  var xRot = 0;
  var yRot = 0;
  var xPos = 50;
  var yPos = 200;
  var zPos = 50;
  var xPosT = xPos;
  var yPosT = yPos;
  var zPosT = zPos;

  var ray = {x:0, y:0, z:0};

  var charHeight = 5;
  var charWidth = 2;
  var charDepth = 2;

  var speed = 200;

  var oldTime;
  var curTime;
  var firstpos = true;

  //seconds
  var jumpTime = 0.3;
  var jumpStart;
  var jumpHeight = 1;

  var scene;
  var map;

  var cubes = [];

  var fps;
  var sampling = false;

  var texturesSrc = ['textures/terrain.png', 'textures/skybox.png'];

  var AGGLManager = function AGGLManager(canvasId) {

    var self = this;

    PhiloGL(canvasId, {
      program: [{
          id: 'vertex',
            from: 'defaults'
        }, {
            id: 'fragment',
            from: 'ids',
            vs: 'per-fragment-lighting-vs',
            fs: 'per-fragment-lighting-fs'
        }, {
          id: 'transparent',
            from: 'ids',
            vs: 'vsblend',
            fs: 'fsblend'
        }],
        onLoad: function(app) {

          //Unpack app properties
          var gl = app.gl,
          canvas = app.canvas,
          camera = app.camera,
          program = app.program,
          raf = Fx.requestAnimationFrame || window.requestAnimationFrame;

          self.gl = gl;
          self.canvas = canvas;
          self.camera = camera;
          self.raf = raf;

          window.scene = app.scene;
          scene = app.scene;
          //Basic gl setup
          gl.clearColor(0, 0, 0, 1);
          gl.clearDepth(1.0);
          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LEQUAL);
          gl.viewport(0, 0, +canvas.width, +canvas.height);

          var p = 0;

          //Run Drawing Loop
          self.draw();
        },
      scene: {
        lights: {
         enable: true,
         points: [{
           position: {
             x: 0, y: 250, z: 0
           },
           diffuse: {
             r: 0.5, g: 0.5, b: 0.5
           },
           specular: {
             r: 0.7, g: 0.7, b: 0.7
           }
         },
         {
           position: {
             x: -100, y: 200, z: 100
           },
           diffuse: {
             r: 0.5, g: 0.5, b: 0.5
           },
           specular: {
             r: 0.7, g: 0.7, b: 0.7
           }
         }],
         ambient: {r: 0.5, g: 0.5, b: 0.5}
       },
       effects: {
          fog: {
            near: 0.5,
            far: 1000,
            color: {
              r: 1, g: 1, b: 1
            }
          }
        }
      },
      camera: {
          position: {
              x: xPos, y: yPos, z: zPos
          },
          fov: 90,
          far: 1000
        },
        onError: function(z) {
        alert("There was an error creating the app : " + z);
      },
        events: {
          /*
          onKeyDown: function(e) {

            if(uiManager.chat.getVisibility().isInputVisible)
            {
              if(e.key == 'enter') {
                uiManager.chat.sendMessage();
              }
              else if(e.key == 'esc') {
                uiManager.chat.toggleVisible();
              }
              return;
            }
            switch(e.key) {
                case 'z':
                  regMovFact = 0.1;
                  break;
                case 's':
                  regMovFact = -0.1;
                  break;
                case 'q':
                  latMovFact = 0.1;
                  break;
                case 'd':
                  latMovFact = -0.1;
                  break;
                case 'enter':
                  uiManager.toggleVisible();
                  break;
                case 'space':
              if(!jumpFact)
                jumpFact = 1;
                  break;
            }

          },
          onKeyUp: function(e) {
          switch(e.event.keyCode)
            {
                case 83:
                case 90:
                  regMovFact = 0;
                  break;
                case 81:
                case 68:
                  latMovFact = 0;
                  break;
            }
          },
          onMouseMove: function(e) {
            if(!uiManager.chat.isVisible) {
              xRot = e.y*180/this.canvas.height;
              yRot = e.x*1080/this.canvas.width;
            }
          }*/
        },
        textures: {
          src: texturesSrc,
            parameters: [{
              name: 'TEXTURE_MIN_FILTER',
              value: 'NEAREST_MIPMAP_NEAREST',
              generateMipmap: true
            },
            {
              name: 'TEXTURE_MAG_FILTER',
              value: 'LINEAR'
            }]
        }
    });
  };

  AGGLManager.prototype.draw = function draw() {

    var self = this;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    oldTime = curTime;
    curTime = new Date().getTime();

    if(!sampling) {
      sampling = true;
      setTimeout(function() {
        //uiManager.topMenu.setFps(fps);
        fps = 0;
        sampling = false;
      }, 1000);
    }

      this.processCamera(this.camera);
/*
      for(var i in clients)
      {
        if(clients[i].toRemove)
        {
          clients[i].removeFromScene(scene);
          clients[i] = null;
          delete clients[i];
        }
        else {
          clients[i].model.update();
          clients[i].addToScene(scene);
        }
      }
*/
    scene.render({
      onBeforeRender: function(object, index) {
        if(object.program == "transparent") {
          self.gl.blendFunc(self.gl.SRC_ALPHA, self.gl.ONE);
          //gl.disable(gl.DEPTH_TEST);
          self.gl.enable(self.gl.BLEND);
        }
      },
      onAfterRender: function(object, index) {
        if(object.program == "transparent") {
          self.gl.blendFunc(self.gl.SRC_ALPHA, self.gl.ONE);
          //gl.enable(gl.DEPTH_TEST);
          self.gl.disable(self.gl.BLEND);
        }
      }
    });
    fps++;
    this.raf(this.draw.bind(this));
  };

  AGGLManager.prototype.processMovement = function processMovement(camera) {
    var elapsed = (curTime - oldTime)/1000;
    if(!elapsed)
      elapsed = 0.01;
    var oldxPos = xPosT, oldzPos = zPosT, oldyPos = yPosT;
    xRotRad = xRot/180*Math.PI;
    yRotRad = yRot/180*Math.PI;

    xPos = camera.position[0]-Math.sin(yRotRad)*(speed*elapsed);
    yPos = camera.position[1]+Math.sin(xRotRad)*(speed*elapsed);
    zPos = camera.position[2]+Math.cos(yRotRad)*(speed*elapsed);

    if(jumpFact) {
      if(!jumpStart)
      {
        jumpStart = new Date().getTime();
        setTimeout(function() {
          jumpFact = 0;
          jumpStart = null;
        }, jumpTime*1000);
      }
      else {
        var alpha = (((new Date().getTime() - jumpStart)/(jumpTime*1000))*180)/180*Math.PI;
        yPosT += Math.sin(alpha)*jumpHeight;
      }
    }

    if(gravFact && colFact && !jumpFact)
    {
      var nray = {x:0, y:yPosT-(speed*elapsed)*gravFact*0.1-oldyPos, z:0};

      if(nray.x || nray.y || nray.z)
          ray = nray;

      var colFactor = map.isColliding(-xPosT, yPosT-(speed*elapsed)*gravFact*0.1, -zPosT, ray);
      if(!colFactor.xz)
      {
        yPosT -= (speed*elapsed)*gravFact*0.1;
      }
    }

    if(regMovFact)
    {
      if(colFact)
      {

        var nray = {x:xPosT-Math.sin(yRotRad)*(speed*elapsed)*regMovFact-oldxPos, y:yPosT+Math.sin(xRotRad)*(speed*elapsed)*regMovFact-oldyPos, z:zPosT+Math.cos(yRotRad)*(speed*elapsed)*regMovFact-oldzPos};

        if(nray.x || nray.y || nray.z)
          ray = nray;

        var colFactor = map.isColliding(-xPosT-Math.sin(yRotRad)*(speed*elapsed)*regMovFact, yPosT+Math.sin(xRotRad)*(speed*elapsed)*regMovFact, -zPosT+Math.cos(yRotRad)*(speed*elapsed)*regMovFact, ray);

        if(!colFactor.yz)
        {
          xPosT += -Math.sin(yRotRad)*(speed*elapsed)*regMovFact;
        }
        if(!colFactor.xz)
        {
          if(!gravFact)
            yPosT += +Math.sin(xRotRad)*(speed*elapsed)*regMovFact;
        }
        if(!colFactor.xy)
        {
          zPosT += +Math.cos(yRotRad)*(speed*elapsed)*regMovFact;
        }
      }
      else {
        xPosT += -Math.sin(yRotRad)*(speed*elapsed)*regMovFact;
        yPosT += +Math.sin(xRotRad)*(speed*elapsed)*regMovFact;
        zPosT += +Math.cos(yRotRad)*(speed*elapsed)*regMovFact;
      }

    }

    if(latMovFact)
    {
      if(colFact) {
        var latRay = {x: (xPosT + Math.cos(yRotRad)*(speed*elapsed)*latMovFact) - xPosT, y: 0, z: (zPosT + Math.sin(yRotRad)*(speed*elapsed)*latMovFact - zPosT)};

        var colFactor = map.isCollidingLateral(-xPosT + Math.cos(yRotRad)*(speed*elapsed)*latMovFact, yPosT, -zPosT + Math.sin(yRotRad)*(speed*elapsed)*latMovFact, latRay);

        if(!colFactor.yz) {
          xPos += Math.cos(yRotRad)*(speed*elapsed)*latMovFact;
          xPosT += Math.cos(yRotRad)*(speed*elapsed)*latMovFact;
        }
        if(!colFactor.xy) {
          zPos += Math.sin(yRotRad)*(speed*elapsed)*latMovFact;
          zPosT += Math.sin(yRotRad)*(speed*elapsed)*latMovFact;
        }
      }
      else {
        xPos += Math.cos(yRotRad)*(speed*elapsed)*latMovFact;
        xPosT += Math.cos(yRotRad)*(speed*elapsed)*latMovFact;
        zPos += Math.sin(yRotRad)*(speed*elapsed)*latMovFact;
        zPosT += Math.sin(yRotRad)*(speed*elapsed)*latMovFact;
      }
    }

    if((oldxPos != xPosT || oldzPos != zPosT) || firstpos === true)
    {
      firstpos = false;
      //socket.emit('clientMoved', {x: xPosT, y:yPosT, z: zPosT});
    }
  };

  AGGLManager.prototype.processCamera = function processCamera (camera) {

    this.processMovement(camera);
    camera.view.id().$rotateAxis(-xRotRad, new PhiloGL.Vec3(1, 0, 0)).$rotateAxis(yRotRad, new PhiloGL.Vec3(0, 1, 0)).$translate(xPosT, -yPosT, zPosT);

  };

  return AGGLManager;

});