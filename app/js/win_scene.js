'use strict';

var WinScene = {
  create: function () {
    this.game.add.sprite(0, 0, 'top_bar');
    this.game.add.sprite(0, 40, 'background');

    var text = this.game.add.text(350, 200, 'You ROCK!', {
      font: '40px monospace',
      fill: '#0f0',
      stroke: '#000',
      strokeThickness: 10
    });
    text.anchor.setTo(0.5, 0.5);

    var msg = 'You managed to keep the business\nopen for a full year.';
    text = this.game.add.text(350, 300, msg, {
      font: '20px monospace',
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 10,
      align: 'center'
    });
    text.anchor.setTo(0.5, 0.5);

    this.game.add.button(350, 380, 'retry', location.reload.bind(location))
      .anchor.setTo(0.5, 0);
  }
};

module.exports = WinScene;
