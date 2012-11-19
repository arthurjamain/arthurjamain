define([
  'underscore',
  'backbone',
  'jquery',
  'socket.io'
], function(_, Backbone, $, io) {
  
  var App = function(opt) {
    this.initialize(opt);
    window.app = this;
  };
  
  _.extend(App.prototype, Backbone.Events, {
    
    socket: null,
    
    /**
     * Initialize the applications.
     *
     * @function
     */
    initialize: function(opt) {
      
      console.log(io);
      
      this.socket = io.connect('http://192.168.1.43:27042');
      $('#startbutton').on('click', _.bind(function() {
        this.socket.emit('player.play')
      }, this));
      $('#stopbutton').on('click', _.bind(function() {
        this.socket.emit('player.stop')
      }, this));
      
    }
  });
  
  return App;
  
});