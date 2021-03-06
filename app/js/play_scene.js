'use strict';

var Antro = require('./antro.js');
var Crowd = require('./crowd.js');
var UIStats = require('./ui_stats.js');
var Panel = require('./panel.js');
var utils = require('./utils.js');


var GAME_SPEED = {
  BALLAD: 1000,
  ROCKNROLL: 500,
  DRAGONFORCE: 250
};

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Nov', 'Dec'];
var TICKS_PER_MONTH = 30;

var BANNER_POSITION = {
  waiter: { x: 570, y: 150 },
  purchase: { x: 420, y: 50 },
  beerSale: { x: 365, y: 185 },
  wineSale: { x: 460, y: 80 },
  vodkaSale: { x: 640, y: 80 }
};

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
    _antro = new Antro(this.game, TICKS_PER_MONTH);
    _ui = setupUI(this.game);

    var decoration = this.game.add.group();
    decoration.position.setTo(0, 40);
    decoration.create(0, 0, 'background');

    this.waiter = decoration.create(600, 206, 'waiter');
    this.waiter.anchor.setTo(0.5, 0.5);

    var waiterTween = this.game.add.tween(this.waiter);
    waiterTween.to({
      y: this.waiter.y + 4
    }, 500, Phaser.Easing.Default, true, 0, -1, true);

    decoration.create(280, 40, 'bar');

    this.crowd = new Crowd(this.game, _antro);

    this.addListeners();
    this.startGame();
    this.crowd.update();

  },

  render: function () {
    _ui.topBar.render({
      month: MONTHS[Math.min(this.currentMonth, MONTHS.length - 1)],
      antro: _antro
    });
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
    this.crowd.update();
    this.currentTick++;
  },

  onMonthEnd: function () {
    console.log(MONTHS[this.currentMonth], 'ended after', this.currentTick,
      'ticks');

    this.currentMonth++;
    this.currentTick = 0;
    if (this.currentMonth >= MONTHS.length) { // victory
      _ui.panel.disable();
      this.game.state.start('win');
    }
    else if (_antro.stats.money < 0) { // game over
      _ui.panel.disable();
      this.game.state.start('gameover');
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
    _ui.panel.onBuyAlcohol.add(function (data) {
      if (_antro.buyAlcohol(data.which)) {
        _ui.panel.updateDOMElements();
      }
    }, this);

    _ui.panel.onHireWaiter.add(function (data) {
      _antro.hireWaiter(data.who);
    }, this);

    _antro.onSpend.add(function (data) {
      var position = BANNER_POSITION[data.concept];
      utils.popupBanner(this.game, position.x, position.y, data.msg, {
        fill: '#f00'
      });
    }, this);

    _antro.onEarn.add(function (data) {
      // TODO: refactor with previous block
      var position = BANNER_POSITION[data.concept];
      utils.popupBanner(this.game, position.x, position.y, data.msg, {
        fill: '#0f0'
      });
    }, this);
  }
};

module.exports = PlayScene;
