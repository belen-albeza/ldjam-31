'use strict';

var _ = require('lodash-node');

var _antro;
var _dom;

function fetchDOMElements() {
  return {
    beerButton: document.querySelector('#beer button'),
    beerProgress: document.querySelector('#beer progress'),

    wineButton: document.querySelector('#wine button'),
    wineProgress: document.querySelector('#wine progress'),

    vodkaButton: document.querySelector('#vodka button'),
    vodkaProgress: document.querySelector('#vodka progress'),

    lazyWaiterPrice: document.querySelector('#waiter-price-lazy'),
    normalWaiterPrice: document.querySelector('#waiter-price-normal'),
    epicWaiterPrice: document.querySelector('#waiter-price-epic'),

    waiterForm: document.querySelector('form#waiter'),
    waiterRadioLazy: document.querySelector('form#waiter input[value=lazy]'),
    waiterRadioNormal: document
      .querySelector('form#waiter input[value=normal]'),
    waiterRadioEpic: document.querySelector('form#waiter input[value=epic]')
  };
}

function bindSignal(el, signal, evtData, evtName) {
  var eventName = evtName || 'click';
  var data = evtData || {};

  el.addEventListener(eventName, function (e) {
    e.preventDefault();
    signal.dispatch(data);
  });
}


function Panel (antro) {
  _antro = antro;
  _dom = fetchDOMElements();

  var initSignals = function () {
    // alcohol
    this.onBuyAlcohol = new Phaser.Signal();
    bindSignal(_dom.beerButton, this.onBuyAlcohol, { which: 'beer'});
    bindSignal(_dom.wineButton, this.onBuyAlcohol, { which: 'wine'});
    bindSignal(_dom.vodkaButton, this.onBuyAlcohol, { which: 'vodka'});

    // waiters
    this.onHireWaiter = new Phaser.Signal();
    _.each([
      _dom.waiterRadioLazy,
      _dom.waiterRadioNormal,
      _dom.waiterRadioEpic
    ], function (x) {
      bindSignal(x, this.onHireWaiter, { who: x.value }, 'change');
    }.bind(this));
  }.bind(this);

  this.container = document.getElementById('panel');
  initSignals();
  this.updateDOMElements();
}

Panel.prototype.enable = function () {
  this.container.style.display = 'block';
};

Panel.prototype.disable = function () {
  this.container.style.display = 'none';
};

Panel.prototype.cleanUp = function () {
  // TODO: remove event listeners
};

Panel.prototype.updateDOMElements = function () {
  if (!_dom || !_antro) { return; }

  _dom.beerButton.innerHTML = 'Buy beer §' + _antro.PRICES.alcohol.beer;
  _dom.wineButton.innerHTML = 'Buy wine §' + _antro.PRICES.alcohol.wine;
  _dom.vodkaButton.innerHTML = 'Buy vodka §' + _antro.PRICES.alcohol.vodka;

  _dom.beerProgress.value = _antro.availableAlcohol('beer');
  _dom.wineProgress.value = _antro.availableAlcohol('wine');
  _dom.vodkaProgress.value = _antro.availableAlcohol('vodka');

  _dom.lazyWaiterPrice.innerHTML = _antro.PRICES.staff.waiter.lazy;
  _dom.normalWaiterPrice.innerHTML = _antro.PRICES.staff.waiter.normal;
  _dom.epicWaiterPrice.innerHTML = _antro.PRICES.staff.waiter.epic;
};

module.exports = Panel;
