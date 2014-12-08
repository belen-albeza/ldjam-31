'use strict';

var Heavy = require('./heavy.js');
var utils = require('./utils.js');

var X = 0;
var Y = 372;
var WIDTH = 700;
var HEIGHT = 200;

var _game;

function randomPosition() {
  if (!_game) {
    return { x: 0, y: 0 };
  }
  else {
    return {
      x: _game.rnd.between(0, WIDTH),
      y: _game.rnd.between(0, HEIGHT)
    };
  }
}

function Crowd(game, antro) {
  this.group = game.add.group();
  this.group.position.setTo(X, Y);

  this.antro = antro;
  _game = game;
}

Crowd.prototype.update = function () {
  var delta = this.antro.stats.population - this.count();
  if (delta > 0) {
    var position = randomPosition();
    utils.spawnSprite(this.group, Heavy, position.x, position.y);
    this._reorderGroup();
  }
  else if (delta < 0) {
    var heavy = this.group.getFirstAlive();
    if (heavy) { heavy.kill(); }
  }
};

Crowd.prototype.count = function () {
  return this.group.filter(function () { return true; }, true).total;
};

Crowd.prototype._reorderGroup = function () {
  this.group.customSort(function (a, b) {
    return (a.y - b.y);
  });
};


module.exports = Crowd;
