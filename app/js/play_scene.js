'use strict';

// var Antro = require('./antro.js');

var UI_FONT_STYLE = {
  font: '20px monospace',
  fill: '#fff',
  align: 'left'
};

var GAME_SPEED = {
  BALLAD: 1000,
  ROCKNROLL: 500,
  DRAGONFORCE: 250
};

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Nov', 'Dec'];
var TICKS_PER_MONTH = 3;

function setupUI(game) {
  // top bar with stats
  var topBar = game.add.group();
  topBar.create(0, 0, 'top_bar');

  game.add.text(20, 20, 'H: 100', UI_FONT_STYLE, topBar).anchor.setTo(0, 0.5);
  game.add.text(120, 20, 'D: 100', UI_FONT_STYLE, topBar).anchor.setTo(0, 0.5);
  game.add.text(220, 20, '§: 999999', UI_FONT_STYLE, topBar)
    .anchor.setTo(0, 0.5);

  // right panel with buttons
  var panel = game.add.group();
  panel.position.setTo(700, 40);
  panel.create(0, 0, 'panel');
}


var PlayScene = {
  create: function () {
    setupUI(this.game);
    this.openAntro();
  },

  openAntro: function () {
    console.log('Antro opens!');
    this.gameSpeed = GAME_SPEED.BALLAD;

    this.currentMonth = 0;
    this.currentTick = 0;

    this.startMonthTimer();
  },

  tick: function () {
    this.currentTick++;
  },

  onMonthEnd: function () {
    console.log('* * * * *');
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
  }
};

module.exports = PlayScene;
