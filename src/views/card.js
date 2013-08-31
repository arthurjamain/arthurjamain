define([
  'jquery',
  'src/lib/joshlib/Item.js',
  'tpl!templates/card.ejs'
], function (
  $,
  Item,
  tplCard
) {

  return Item.extend({

    id            : 'card',
    className     : 'card',

    initialize    : function (opt) {
      opt = opt || {};

      opt.template = tplCard;
      this.currentIndex = 0;
      this.currentSlide = 'about';
      Item.prototype.initialize.call(this, opt);
    },

    enhance        : function () {
      var self = this;
      Item.prototype.enhance.call(this);

      this.slideWidth = parseInt(this.$('section').width(), 10);
      this.$slider = this.$('.slider');
      this.$('.upper, .lower').on('click', function() {
        self.$el.toggleClass('open');
      });

      this.$('.link').on('click', function() {
        var $from = self.$('.current'),
            $to,
            targetClass = $(this).data('target'),
            targetIndex = $(this).parent().index(),
            direction = self.currentIndex < targetIndex ? 'l' : 'r';

        if(targetClass && targetClass !== self.currentSlide) {
          self.currentIndex = targetIndex;
          self.currentSlide = targetClass;
          $to = self.$('.slide.' + targetClass);

          $to.removeClass('lin lout rin rout animable').addClass(direction + 'in');
          $from.removeClass('lin lout rin rout animable').addClass(direction + 'out');

          $('.selected-menu').removeClass('selected-menu');
          $(this).addClass('selected-menu');

          setTimeout(function() {
            $to.addClass('animable current');
            $from.addClass('animable').removeClass('current');
          });
        }

      });
    }
  });
});