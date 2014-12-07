'use strict';

var utils = require('./utils.js');

var IntroScene = {
  create: function () {
    this.game.add.sprite(0, 0, 'top_bar');
    this.game.add.sprite(0, 40, 'background');
    this.game.add.sprite(280, 80, 'bar');

    utils.spawnRat(this.game);

    var text = this.game.add.text(350, 200, 'ROCK ON!', {
      font: '40px monospace',
      fill: '#0f0',
      stroke: '#000',
      strokeThickness: 10
    });
    text.anchor.setTo(0.5, 0.5);

    var msg = 'You just opened a metal bar \\m/\n' +
      'Can you run it for 12 months?';
    text = this.game.add.text(350, 300, msg, {
      font: '20px monospace',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 10,
      align: 'center'
    });
    text.anchor.setTo(0.5, 0.5);

    this.game.add.button(350, 380, 'play', function () {
      this.game.state.start('play');
    }, this).anchor.setTo(0.5, 0);

    var music = this.game.add.audio('bgm');
    music.play('', 0, 1, true); // loop sound
  }
};

module.exports = IntroScene;
