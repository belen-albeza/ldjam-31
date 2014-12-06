'use strict';

var _ = require('lodash-node');

var UI_FONT_STYLE = {
  font: '24px monospace',
  fill: '#fff',
  align: 'left'
};


function UIStats(game) {
  this.group = game.add.group();
  this.group.create(0, 0, 'top_bar');

  this.texts = {
    month: game.add.text(20, 20, 'Jan', UI_FONT_STYLE, this.group),
    happiness: game.add.text(120, 20, '☺︎ 0', UI_FONT_STYLE, this.group),
    drunkenness: game.add.text(220, 20, '☣ 0%', UI_FONT_STYLE, this.group),
    population: game.add.text(320, 20, '♥︎ 0', UI_FONT_STYLE, this.group),
    money: game.add.text(420, 20, '§0', UI_FONT_STYLE, this.group)
  };

  _.each(this.texts, function (x) {
    x.anchor.setTo(0, 0.5);
  });

}

UIStats.prototype.render = function (data) {
  this.texts.month.setText(data.month);
  this.texts.happiness.setText('☺︎ ' + data.antro.stats.happiness);
  this.texts.drunkenness.setText(
    '☣ ' + Math.round(data.antro.stats.drunkenness * 100) + '%');
  this.texts.money.setText('§' + data.antro.stats.money);
  this.texts.population.setText('♥︎ ' + data.antro.stats.population);
};

module.exports = UIStats;
