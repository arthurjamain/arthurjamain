define([
  'src/lib/joshlib/Layout.js',
  'tpl!templates/layout.ejs'
], function(
  Layout,
  tplLayout
) {

  return Layout.extend({

    initialize    : function (opt) {

      opt = opt || {};
      opt.template = tplLayout;

      Layout.prototype.initialize.call(this, opt);
    }

  });

});