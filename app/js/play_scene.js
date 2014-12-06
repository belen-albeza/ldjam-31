'use strict';

var antro = require('./antro.js');
var UIStats = require('./ui_stats.js');


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
  var topBar = new UIStats(game, antro);

  // right panel with buttons
  var panel = game.add.group();
  panel.position.setTo(700, 40);
  panel.create(0, 0, 'panel');

  return { topBar: topBar, panel: panel };
}


var PlayScene = {
  create: function () {
    this.ui = setupUI(this.game);
    this.openAntro();
  },

  render: function () {
    this.ui.topBar.render();
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
