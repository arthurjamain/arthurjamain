define([
  'underscore',
  'lib/Events',
  'philogl'
],
function (
  _,
  Events
) {

  var AGGLManager = function AGGLManager(opt) {

    PhiloGL.unpack();
    this.app = opt.app;
    this.initialize(opt.canvas);

  };

  _.extend(AGGLManager.prototype, Events, {

    textures    : [
      'textures/terrain.png',
      'textures/skybox.png'
    ],

    regMovFact  : 0,
    latMovFact  : 0,
    gravFact    : 0,
    jumpFact    : 0,
    colFact     : 1,

    oldMouseX   : 0,
    oldMouseY   : 0,
    xRot        : 0,
    yRot        : 0,
    xPos        : 50,
    xPosT       : 50,
    yPos        : 200,
    yPosT       : 200,
    zPos        : 50,
    zPosT       : 50,

    ray         : { x:0, y:0, z:0 },
    speed       : 200,
    oldTime     : 0,
    curTime     : 0,
    firstPos    : true,
    jumpTime    : 0.3,
    jumpStart   : 0,
    jumpHeight  : 1,
    fps         : 0,
    sampling    : false,

    scene       : null,
    map         : null,

    initialize  : function (canvasId) {

      var self = this;

      PhiloGL(canvasId, {
        program: [
          {
            id: 'vertex',
              from: 'defaults'
          },
          {
              id: 'fragment',
              from: 'ids',
              vs: 'per-fragment-lighting-vs',
              fs: 'per-fragment-lighting-fs'
          },
          {
            id: 'transparent',
              from: 'ids',
              vs: 'vsblend',
              fs: 'fsblend'
          }
        ],
        onLoad: function(app) {

          self.gl = app.gl;
          self.canvas = app.canvas;
          self.camera = app.camera;
          self.raf = Fx.requestAnimationFrame || window.requestAnimationFrame;

          self.scene = app.scene;
          //Basic gl setup
          self.gl.clearColor(0, 0, 0, 1);
          self.gl.clearDepth(1.0);
          self.gl.enable(self.gl.DEPTH_TEST);
          self.gl.depthFunc(self.gl.LEQUAL);
          self.gl.viewport(0, 0, self.canvas.width, self.canvas.height);

          var p = 0;

          self.trigger('load');

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
                x: self.xPos, y: self.yPos, z: self.zPos
            },
            fov: 90,
            far: 1000
          },
          onError: function(z) {
          alert("There was an error creating the app : " + z);
        },
        events: {

          onKeyDown: function(e) {
            switch(e.key) {
                case 'z':
                  self.regMovFact = 0.1;
                  break;
                case 's':
                  self.regMovFact = -0.1;
                  break;
                case 'q':
                  self.latMovFact = 0.1;
                  break;
                case 'd':
                  self.latMovFact = -0.1;
                  break;
                case 'space':
              if(!self.jumpFact)
                self.jumpFact = 1;
                  break;
            }

          },
          onKeyUp: function(e) {
          switch(e.event.keyCode)
            {
                case 83:
                case 90:
                  self.regMovFact = 0;
                  break;
                case 81:
                case 68:
                  self.latMovFact = 0;
                  break;
            }
          },
          onMouseMove: function(e) {
            self.xRot = e.y*180/self.canvas.height;
            self.yRot = e.x*1080/self.canvas.width;
          }
        },
        textures: {
          src         : this.textures,
          parameters  : [{
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
    },

    draw: function draw() {

      var self = this;

      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      this.oldTime = this.curTime;
      this.curTime = new Date().getTime();

      if(!this.sampling) {
        this.sampling = true;
        setTimeout(function() {
          //uiManager.topMenu.setFps(self.fps);
          self.fps = 0;
          self.sampling = false;
        }, 1000);
      }

      this.processCamera(this.camera);

      for(var i in this.app.clients)
      {
        if(this.app.clients[i].toRemove)
        {
          this.app.clients[i].removeFromScene(this.scene);
          this.app.clients[i] = null;
          delete this.app.clients[i];
        }
        else {
          this.app.clients[i].addToScene(this.scene);
          this.app.clients[i].model.update();
        }
      }

      this.scene.render({
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

      this.fps++;
      this.raf(this.draw.bind(this));
    },

    processMovement: function processMovement(camera) {
      var elapsed = (this.curTime - this.oldTime)/1000;
      if(!elapsed)
        elapsed = 0.01;
      var oldxPos = this.xPosT, oldzPos = this.zPosT, oldyPos = this.yPosT;
      xRotRad = this.xRot/180*Math.PI;
      yRotRad = this.yRot/180*Math.PI;

      this.xPos = camera.position[0]-Math.sin(yRotRad)*(this.speed*elapsed);
      this.yPos = camera.position[1]+Math.sin(xRotRad)*(this.speed*elapsed);
      this.zPos = camera.position[2]+Math.cos(yRotRad)*(this.speed*elapsed);

      if(this.jumpFact) {
        if(!this.jumpStart)
        {
          this.jumpStart = new Date().getTime();
          setTimeout(function() {
            this.jumpFact = 0;
            this.jumpStart = null;
          }, this.jumpTime*1000);
        }
        else {
          var alpha = (((new Date().getTime() - this.jumpStart)/(this.jumpTime*1000))*180)/180*Math.PI;
          yPosT += Math.sin(alpha)*this.jumpHeight;
        }
      }

      if(this.gravFact && this.colFact && !this.jumpFact)
      {
        var nray = {x:0, y:yPosT-(this.speed*elapsed)*this.gravFact*0.1-oldyPos, z:0};

        if(nray.x || nray.y || nray.z)
            ray = nray;

        var colFactor = this.app.map.isColliding(-this.xPosT, this.yPosT-(this.speed*elapsed)*this.gravFact*0.1, -this.zPosT, ray);
        if(!colFactor.xz)
        {
          yPosT -= (this.speed*elapsed)*this.gravFact*0.1;
        }
      }

      if(this.regMovFact)
      {
        if(this.colFact)
        {

          var nray = {x:this.xPosT-Math.sin(yRotRad)*(this.speed*elapsed)*this.regMovFact-oldxPos, y:this.yPosT+Math.sin(xRotRad)*(this.speed*elapsed)*this.regMovFact-oldyPos, z:this.zPosT+Math.cos(yRotRad)*(this.speed*elapsed)*this.regMovFact-oldzPos};

          if(nray.x || nray.y || nray.z)
            ray = nray;

          var colFactor = this.app.map.isColliding(-this.xPosT-Math.sin(yRotRad)*(this.speed*elapsed)*this.regMovFact, this.yPosT+Math.sin(xRotRad)*(this.speed*elapsed)*this.regMovFact, -this.zPosT+Math.cos(yRotRad)*(this.speed*elapsed)*this.regMovFact, ray);

          if(!colFactor.yz)
          {
            this.xPosT += -Math.sin(yRotRad)*(this.speed*elapsed)*this.regMovFact;
          }
          if(!colFactor.xz)
          {
            if(!this.gravFact) {
              this.yPosT += +Math.sin(xRotRad)*(this.speed*elapsed)*this.regMovFact;
            }
          }
          if(!colFactor.xy)
          {
            this.zPosT += +Math.cos(yRotRad)*(this.speed*elapsed)*this.regMovFact;
          }
        }
        else {
          this.xPosT += -Math.sin(yRotRad)*(this.speed*elapsed)*this.regMovFact;
          this.yPosT += +Math.sin(xRotRad)*(this.speed*elapsed)*this.regMovFact;
          this.zPosT += +Math.cos(yRotRad)*(this.speed*elapsed)*this.regMovFact;
        }

      }

      if(this.latMovFact)
      {
        if(this.colFact) {
          var latRay = {x: (this.xPosT + Math.cos(yRotRad)*(this.speed*elapsed)*this.latMovFact) - this.xPosT, y: 0, z: (this.zPosT + Math.sin(yRotRad)*(this.speed*elapsed)*this.latMovFact - this.zPosT)};

          var colFactor = this.app.map.isCollidingLateral(-this.xPosT + Math.cos(yRotRad)*(this.speed*elapsed)*this.latMovFact, this.yPosT, -this.zPosT + Math.sin(yRotRad)*(this.speed*elapsed)*this.latMovFact, latRay);

          if(!colFactor.yz) {
            this.xPos += Math.cos(yRotRad)*(this.speed*elapsed)*this.latMovFact;
            this.xPosT += Math.cos(yRotRad)*(this.speed*elapsed)*this.latMovFact;
          }
          if(!colFactor.xy) {
            this.zPos += Math.sin(yRotRad)*(this.speed*elapsed)*this.latMovFact;
            this.zPosT += Math.sin(yRotRad)*(this.speed*elapsed)*this.latMovFact;
          }
        }
        else {
          this.xPos += Math.cos(yRotRad)*(this.speed*elapsed)*this.latMovFact;
          this.xPosT += Math.cos(yRotRad)*(this.speed*elapsed)*this.latMovFact;
          this.zPos += Math.sin(yRotRad)*(this.speed*elapsed)*this.latMovFact;
          this.zPosT += Math.sin(yRotRad)*(this.speed*elapsed)*this.latMovFact;
        }
      }

      if((oldxPos != this.xPosT || oldzPos != this.zPosT) || this.firstpos)
      {
        this.firstpos = false;
        this.app.socket.emit('clientMoved', {x: this.xPosT, y:this.yPosT, z: this.zPosT});
      }
    },

    processCamera: function processCamera (camera) {

      this.processMovement(camera);
      camera.view.id().$rotateAxis(-xRotRad, new PhiloGL.Vec3(1, 0, 0)).$rotateAxis(yRotRad, new PhiloGL.Vec3(0, 1, 0)).$translate(this.xPosT, -this.yPosT, this.zPosT);

    }
  });


  return AGGLManager;

});