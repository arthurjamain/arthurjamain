define([
  'underscore',
  'backbone',
  'jquery',
  'Views/Player'
], function(_, Backbone, $, Player) {
  
  var App = function(opt) {
    this.initialize(opt);
    window.app = this;
  };
  
  _.extend(App.prototype, Backbone.Events, {
    
    socket: null,
    views: {
      
    },
    /**
     * Initialize the applications.
     *
     * @function
     */
    initialize: function(opt) {
            
      this.createPlayer();
      this.views.player.render();
      
      this.views.player.on('play', function() {
        console.log('yay');
      })
    },
    
    createPlayer: function() {
      
      this.views.player = new Player({
        el: '#player'
      });
    }
  });
  
  return App;
  
});