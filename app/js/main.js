'use strict';

var PlayScene = require('./play_scene.js');
var WinScene = require('./win_scene.js');
var GameOverScene = require('./gameover_scene.js');
var IntroScene = require('./intro_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // load here the assets for the game
    this.game.load.image('top_bar', 'images/top_bar.png');
    this.game.load.image('panel', 'images/right_panel.png');
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('bar', 'images/bar.png');
    this.game.load.image('waiter', 'images/waiter.png');
    this.game.load.image('heavy00', 'images/heavy00.png');
    this.game.load.image('heavy01', 'images/heavy01.png');
    this.game.load.image('heavy02', 'images/heavy02.png');
    this.game.load.image('retry', 'images/retry.png');
    this.game.load.image('play', 'images/play.png');
    this.game.load.image('icon_population', 'images/icon_population.png');
    this.game.load.image('icon_beer', 'images/icon_beer.png');
    this.game.load.image('icon_happiness', 'images/icon_happiness.png');

    this.game.load.spritesheet('rat', 'images/rat.png', 68, 20);
  },

  create: function () {
    this.game.state.start('intro');
  }
};


window.onload = function () {
  var game = new Phaser.Game(700, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('win', WinScene);
  game.state.add('gameover', GameOverScene);
  game.state.add('intro', IntroScene);

  game.state.start('boot');
};
