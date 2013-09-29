requirejs.config({
  baseUrl: '/mc',
  paths: {
    'jquery'      : 'lib/jquery',
    'philogl'     : 'lib/PhiloGL',
    'underscore'  : 'lib/underscore',
    'socket.io'  : document.location.protocol + '//' + document.location.hostname + '/socket.io/socket.io.js'
  }
});

define(['src/AGApp'], function(AGApp) {

  window._app = new AGApp();

});