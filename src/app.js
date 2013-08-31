define([
  'underscore',
  'backbone',
  'jquery',
  'views/layout',
  'views/content',
  'views/card'
], function(
  _,
  Backbone,
  $,
  Layout,
  Content,
  Card
) {

  var App = function(opt) {
    this.initialize(opt);
    window.app = this;
  };

  var Views = {
    Card: Card,
    Content: Content
  };

  _.extend(App.prototype, Backbone.Events, {

    socket: null,

    /**
     * Initialize the applications.
     *
     * @function
     */
    initialize: function(opt) {

      this.initLayout(opt);
      this.layout.render();

    },

    initLayout: function() {
      var card = this.createView('Card', {
        model: new Backbone.Model({a: 'b'})
      });
      var content = this.createView('Content', {

      });
      this.layout = new Layout({
        el: '#app',
        children: {
          card: card,
          content: content
        }
      });

      return this.layout;
    },

    createView: function(view, opt) {
      opt = _.extend(opt || {}, {

      });
      return new Views[view](opt);
    }

  });

  return App;

});