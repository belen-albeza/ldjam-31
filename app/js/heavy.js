'use strict';

var _ = require('lodash-node');

var IMAGES = ['heavy00', 'heavy01', 'heavy02'];

// this inherits from Phaser.Sprite
function Heavy(game, x, y) {
  var img = _.sample(IMAGES);
  Phaser.Sprite.call(this, game, x, y, img);

  this.anchor.setTo(0.5, 1);
};

Heavy.prototype = Object.create(Phaser.Sprite.prototype);
Heavy.prototype.constructor = Heavy;


module.exports = Heavy;
