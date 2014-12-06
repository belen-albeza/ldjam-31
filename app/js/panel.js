'use strict';

var _antro;
var _dom;

function fetchDOMElements() {
  return {
    beerButton: document.querySelector('#beer button'),
    wineButton: document.querySelector('#wine button'),
    vodkaButton: document.querySelector('#vodka button')
  };
}

function bindSignal(el, signal, evtName) {
  var eventName = evtName || 'click';
  el.addEventListener(eventName, function (e) {
    e.preventDefault();
    signal.dispatch();
  });
}

function updateDOMElements() {
  if (!_dom || !_antro) { return; }

  _dom.beerButton.innerHTML = 'Buy beer §' + _antro.PRICES.beer;
  _dom.wineButton.innerHTML = 'Buy wine §' + _antro.PRICES.wine;
  _dom.vodkaButton.innerHTML = 'Buy vodka §' + _antro.PRICES.vodka;
}

function Panel (antro) {
  _antro = antro;
  _dom = fetchDOMElements();

  var initSignals = function () {
    // alcohol
    this.onBuyBeer = new Phaser.Signal();
    bindSignal(_dom.beerButton, this.onBuyBeer);
    this.onBuyWine = new Phaser.Signal();
    bindSignal(_dom.wineButton, this.onBuyWine);
    this.onBuyVodka = new Phaser.Signal();
    bindSignal(_dom.vodkaButton, this.onBuyVodka);
  }.bind(this);

  this.container = document.getElementById('panel');
  initSignals();
  updateDOMElements();
}

Panel.prototype.enable = function () {
  this.container.style.display = 'block';
};

Panel.prototype.cleanUp = function () {
  // TODO: remove event listeners
};

module.exports = Panel;
