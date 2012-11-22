define([
  'lib/joshlib/Layout',
  'lib/joshlib/List',
  'lib/joshlib/Item',
  'backbone',
  'underscore',
  
  'text!Templates/PlayerControls.html',
  'text!Templates/PlayerControl.html',
  'text!Templates/PlayerMeta.html'
], function(
  Layout,
  List,
  Item,
  Backbone,
  _,
  
  tplPlayerControls,
  tplPlayerControl,
  tplPlayerMeta
) {
  return Layout.extend({
    
    events: {
      'click .controls a': 'triggerControlsEvent'
    },
    initialize: function(options) {
    
      this.createControls();
      this.createMeta();
      
      options.children = {
        controls: this.controls,
        meta: this.meta
      };
      
      Layout.prototype.initialize.call(this, options);
    },
    
    createControls: function createControls() {
      this.controls = new List({
        className: 'controls',
        template: tplPlayerControls,
        itemTemplate: tplPlayerControl,
        collection: new Backbone.Collection([
          {
            name: 'Play',
            className: 'play',
            event: 'play'
          },
          {
            name: 'Stop',
            className: 'stop',
            event: 'stop'
          },
          {
            name: 'Previous',
            className: 'previous',
            event: 'previous'
          },
          {
            name: 'Next',
            className: 'next',
            event: 'next'
          }
        ])
      });
    },
    createMeta: function() {
      this.meta = new Item({
        className: 'meta',
        template: tplPlayerMeta,
        // should be this.current or something
        model: new Backbone.Model({
          artist: 'The XX',
          title: 'Intro'
        })
      });
    },
    
    /**
     * The controls got an attribute which carries the name of the
     * event they are meant to trigger. This is what is done here.
     */
    triggerControlsEvent: function triggerControlsEvent(e) {
      var $target = $(e.target);
      this.trigger($target.data('event'));
    }
  });

});