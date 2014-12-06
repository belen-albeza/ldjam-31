'use strict';

// var MAX_POPULATION = 100;
var UNITS_PER_REFILL = 100;

function Antro() {
  this.stats = {
    happiness: 0,
    drunkenness: 0,
    money : 9999,
    population: 10
  };

  this.alcohol = {
    beer: 0,
    wine: 0,
    vodka: 0
  };
}

Antro.prototype.PRICES = {
  beer: 100,
  wine: 500,
  vodka: 2000
};

Antro.prototype.EFFECTS = {
  drunkenness: {
    base: -1 / 100,
    beer: 1.1 / 100,
    wine: 1.2 / 100,
    vodka: 1.5 / 100
  }
};

Antro.prototype.EARNINGS = {
  alcohol: {
    cheap: 1.1,
    normal: 1.2,
    expensive: 1.5
  }
};

Antro.prototype.tick = function () {
  // HANDLE ALCOHOL and DRUNKENNESS
  // consume beer
  var beerPerHeavy = 1;
  this._consumeAlcohol('beer', beerPerHeavy);
  var winePerHeavy = 0.2;
  this._consumeAlcohol('wine', winePerHeavy);
  var vodkaPerHeavy = 0.5;
  this._consumeAlcohol('vodka', vodkaPerHeavy);
  // sober up…
  this._soberUp();
  // clamp values
  this.stats.drunkenness = Math.max(0, Math.min(this.stats.drunkenness, 1));
};

Antro.prototype.buyAlcohol = function (which) {
  var cost = this.PRICES[which];
  if (this._canAfford(cost)) {
    this.alcohol[which] = UNITS_PER_REFILL;
    this._spend(cost);
    console.log('Bought', which, '-§' + cost);
    return true;
  }
  else {
    console.log('Could not afford to buy', which);
    return false;
  }
};

Antro.prototype.availableAlcohol = function (which) {
  console.log('available', which, '->', this.alcohol[which] / UNITS_PER_REFILL);
  return this.alcohol[which] / UNITS_PER_REFILL;
};

Antro.prototype._canAfford = function (cost) {
  return this.stats.money >= cost;
};

Antro.prototype._spend = function (cost) {
  this.stats.money -= cost;
};

Antro.prototype._earn = function (amount) {
  this.stats.money += amount;
};

Antro.prototype._consumeAlcohol = function (which, amountPerHeavy) {
  var consumed = Math.min(this.alcohol[which],
    amountPerHeavy * this.stats.population);
  var moneyPerUnit = this.EARNINGS.alcohol.normal *
    this.PRICES[which] / UNITS_PER_REFILL;

  this.alcohol[which] -= consumed;
  this._earn(moneyPerUnit * consumed);

  if (consumed > 0) {
    this.stats.drunkenness += this.EFFECTS.drunkenness[which];
  }

  console.log('Sold', consumed, which, '+§' + (moneyPerUnit * consumed));
};

Antro.prototype._soberUp = function () {
  this.stats.drunkenness += this.EFFECTS.drunkenness.base;
};

module.exports = Antro;
