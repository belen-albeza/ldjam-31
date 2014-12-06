'use strict';

var Antro = require('./antro.js');
var UIStats = require('./ui_stats.js');
var Panel = require('./panel.js');


var GAME_SPEED = {
  BALLAD: 1000,
  ROCKNROLL: 500,
  DRAGONFORCE: 250
};

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Nov', 'Dec'];
var TICKS_PER_MONTH = 3;

var _antro;
var _ui;

function setupUI(game) {
  // top bar with stats
  var topBar = new UIStats(game, _antro);
  // right control panel
  var panel = new Panel(_antro);

  return { topBar: topBar, panel: panel };
}


var PlayScene = {
  create: function () {
    _antro = new Antro();
    _ui = setupUI(this.game);
    this.addListeners();
    this.startGame();
  },

  render: function () {
    _ui.topBar.render();
  },

  startGame: function () {
    _ui.panel.enable();

    this.gameSpeed = GAME_SPEED.BALLAD;

    this.currentMonth = 0;
    this.currentTick = 0;

    this.startMonthTimer();
  },

  tick: function () {
    _antro.tick();
    _ui.panel.updateDOMElements();
    this.currentTick++;
  },

  onMonthEnd: function () {
    console.log(MONTHS[this.currentMonth], 'ended after', this.currentTick,
      'ticks');

    this.currentMonth++;
    this.currentTick = 0;
    if (this.currentMonth >= MONTHS.length) {
      // end of game
      console.log('END GAME');
    }
    else {
      this.startMonthTimer();
    }
  },

  startMonthTimer: function () {
    this.ticker = this.game.time.create(true);
    this.ticker.repeat(GAME_SPEED.BALLAD, TICKS_PER_MONTH, this.tick, this);
    this.ticker.onComplete.add(this.onMonthEnd, this);
    this.ticker.start();
  },

  addListeners: function () {
    _ui.panel.onBuyBeer.add(function () {
      if (_antro.buyAlcohol('beer')) {
        _ui.panel.updateDOMElements();
      }
    }, this);

    _ui.panel.onBuyWine.add(function () {
      if (_antro.buyAlcohol('wine')) {
        _ui.panel.updateDOMElements();
      }
    }, this);

    _ui.panel.onBuyVodka.add(function () {
      if (_antro.buyAlcohol('vodka')) {
        _ui.panel.updateDOMElements();
      }
    }, this);
  }
};

module.exports = PlayScene;
