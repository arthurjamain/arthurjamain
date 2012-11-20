define([
  'underscore',
  'backbone',
  'jquery',
  'socket.io',
  'lib/joshlib/Layout',
  'lib/joshlib/List',
  'text!Templates/TestList.html',
  'text!Templates/TestListItem.html'
], function(_, Backbone, $, io, Layout, List, tplList, tplListItem) {
  
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
            
      window.l = new List({
        el: '#testlist',
        template: tplList,
        itemTemplate: tplListItem,
        collection: new Backbone.Collection([
          {
            name: 'lulz'
          },
          {
            name: 'lulz2'
          },
          {
            name: 'lulz3'
          }
        ])
      });
      
      l.render();
      
      console.log(l);
      
      this.socket = io.connect('http://raspberrypi.local:27042');
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