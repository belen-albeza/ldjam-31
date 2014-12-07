'use strict';

var _ = require('lodash-node');

module.exports = {
  spawnSprite: function (group, klass, x, y) {
    var instance = group.getFirstExists(false);
    // reuse existing slot if available
    if (instance) {
      instance.reset(x, y);
      if (instance.init) { instance.init(); }
    }
    // if there is not slot available, create a new sprite
    else {
      /*jshint -W055 */
      group.add(new klass(group.game, x, y));
      /*jshint +W055 */
    }
  },

  popupBanner: function (game, x, y, text, styles) {
    styles = styles || {};
    var defaultStyle = {
      font: '20px monospace',
      fill: '#fff',
      fontWeight: 'bold',
      stroke: '#000',
      strokeThickness: 6,
      align: 'center'
    };

    var banner = game.add.text(x, y, text, _.defaults(styles, defaultStyle));
    var tween = game.add.tween(banner);
    tween.onComplete.add(function () {
      game.world.remove(banner);
    });
    tween.to({
      y: y - 50,
      alpha: 0
    }, 1000, Phaser.Easing.Sinusoidal.InOut);
    tween.start();
  }
};
