'use strict';

var utils = require('./utils.js');

var GameOverScene = {
  create: function () {
    this.game.add.sprite(0, 0, 'top_bar');
    this.game.add.sprite(0, 40, 'background');
    this.game.add.sprite(280, 80, 'bar');

    var text = this.game.add.text(350, 200, 'You SUCK!', {
      font: '40px monospace',
      fill: '#f00',
      stroke: '#000',
      strokeThickness: 10
    });
    text.anchor.setTo(0.5, 0.5);

    var msg = 'You went overdraft for way too long\n' +
      'and the bank closed your little metal joint\n\n' +
      'Your metal brothers and sisters\nwill miss you :(';
    text = this.game.add.text(350, 250, msg, {
      font: '20px monospace',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 10,
      align: 'center'
    });
    text.anchor.setTo(0.5, 0);

    utils.spawnRat(this.game);

    this.game.add.button(350, 450, 'retry', location.reload.bind(location))
      .anchor.setTo(0.5, 0);
  }
};

module.exports = GameOverScene;
