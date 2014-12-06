'use strict';

function Antro() {
  this.stats = {
    happiness: 50,
    alcohol: 20,
    money : 9999,
    population: 17
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

Antro.prototype.buyBeer = function () {
  var cost = this.PRICES.beer;
  if (this._canAfford(cost)) {
    this.alcohol.beer = 1;
    this._spend(cost);
    console.log('Beer bought');
    return true;
  }
  else {
    return false;
  }
};

Antro.prototype._canAfford = function (cost) {
  return this.stats.money >= cost;
};

Antro.prototype._spend = function (cost) {
  this.stats.money -= cost;
};

module.exports = Antro;
