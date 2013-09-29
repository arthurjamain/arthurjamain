define([
  'jquery',
  'philogl',
  'underscore',
  'socket.io',
  'lib/Events',
  'src/AGGLManager',
  'src/AGClient',
  'src/AGObjLoader'
], function(
  $,
  phi,
  _,
  io,
  Events,
  AGGLManager,
  AGClient,
  AGObjLoader
) {

  var AGApp = function AGApp() {
    this.initialize();
  };

  _.extend(AGApp.prototype, Events, {

    clients: {},

    initialize: function() {

      var self = this;

      this.initSocket();
      this.initControls();
      this.initSplashScreen();

      this.glManager = new AGGLManager({
        canvas  : 'game',
        app     : this
      });
      this.glManager.on('load', function() {
        self.map = new AGObjLoader(document.location.protocol + '//' + document.location.hostname + '/mc/obj/tower.obj', self.glManager.scene, self);
      });
    },

    initSplashScreen: function() {
      var c = document.getElementById('game');

      this.splash = document.createElement('div');
      this.splash.className = 'splashscreen';
      this.$splash = $(this.splash);

      this.spinner = document.createElement('div');
      this.spinner.className = 'spinner';

      this.progressBar = document.createElement('div');
      this.progressBar.className = 'progress-bar';

      this.progress = document.createElement('div');
      this.progress.className = 'progress';

      this.progressBar.appendChild(this.progress);
      this.splash.appendChild(this.spinner);
      this.splash.appendChild(this.progressBar);


      document.getElementById('AGRoot').appendChild(this.splash);
    },

    setProgress: function(percentage) {

      this.$splash.addClass('show-progress');
      this.progress.style.width = percentage + '%';

    },

    hideSplashScreen: function() {
      this.splash.className += ' hidden';
      $(this.splash).on('transitionEnd webkitTransitionEnd mozTransitionEnd', function() {
        this.parentElement.removeChild(this);
      });
    },

    initControls: function() {

      $('.fullscreen').on('click', this.toggleFullScreen.bind(this));

    },

    toggleFullScreen: function() {

      var c = document.getElementById('game');
      var fse = document.fullScreenElement || document.webkitFullScreenElement || document.mozFullScreenElement;

      if (!c.requestFullscreen) {
        c.requestFullscreen = c.requestFullscreen || c.webkitRequestFullscreen || c.mozRequestFullScreen;
      }
      if (!c.cancelFullScreen) {
        c.cancelFullScreen = c.cancelFullScreen || c.webkitCancelFullScreen || c.mozCancelFullScreen;
      }

      if (c === fse) {
        c.cancelFullScreen();
      } else {
        c.requestFullscreen();
      }
    },


    initSocket: function() {
      this.socket = io.connect(document.location.protocol + '//' + document.location.hostname);

      this.socket.on('newClient', this.onNewClient.bind(this));
      this.socket.on('clientMoved', this.onClientMoved.bind(this));
      this.socket.on('clientQuit', this.onClientQuit.bind(this));
    },
    onNewClient: function (data) {
      this.clients['' + data.ssid] = new AGClient(this.glManager.scene);
    },
    onClientMoved: function (data) {
      if(!this.clients['' + data.ssid])
      {
        this.clients['' + data.ssid] = new AGClient(this.glManager.scene);
      }

      this.clients['' + data.ssid].move(data.x, data.y, data.z);
    },
    onClientQuit: function (data) {
      if(!this.clients['' + data.ssid])
        return;
      this.clients['' + data.ssid].toRemove = true;
    }

  });

  return AGApp;

});