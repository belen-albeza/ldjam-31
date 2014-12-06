'use strict';

// var MAX_POPULATION = 100;
var UNITS_PER_REFILL = 100;

var _TICKS_PER_MONTH;

function Antro(ticksPerMonth) {
  _TICKS_PER_MONTH = ticksPerMonth;

  this.stats = {
    happiness: 0.4,
    drunkenness: 0,
    money : 9999,
    population: 10
  };

  this.alcohol = {
    beer: 0,
    wine: 0,
    vodka: 0
  };

  this.staff = {};

  this.hireWaiter('lazy');
}

Antro.prototype.PRICES = {
  alcohol: {
    beer: 100,
    wine: 500,
    vodka: 2000
  },

  staff: {
    waiter: {
      lazy: 500,
      normal: 800,
      epic: 1500
    }
  }
};

Antro.prototype.EFFECTS = {
  consume: {
    beer: 1,
    wine: 0.2,
    vodka: 0.5
  },

  drunkenness: {
    base: -1 / 100,
    beer: 1.1 / 100,
    wine: 1.2 / 100,
    vodka: 1.5 / 100
  },

  waiterSales: {
    lazy: 0.75,
    normal: 1,
    epic: 1.5
  },

  happiness: {
    base: 1 / 100,
    drinking: {
      low: -1,
      mid: 0.5,
      high: 1
    }
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
  var beerPerHeavy =
    this.EFFECTS.consume.beer * this.EFFECTS.waiterSales[this.staff.waiter];
  this._consumeAlcohol('beer', beerPerHeavy);
  var winePerHeavy =
    this.EFFECTS.consume.wine * this.EFFECTS.waiterSales[this.staff.waiter];
  this._consumeAlcohol('wine', winePerHeavy);
  var vodkaPerHeavy =
    this.EFFECTS.consume.vodka * this.EFFECTS.waiterSales[this.staff.waiter];
  this._consumeAlcohol('vodka', vodkaPerHeavy);
  // sober up…
  this._soberUp();
  // clamp values
  this.stats.drunkenness = Math.max(0, Math.min(this.stats.drunkenness, 1));

  // HANDLE HAPPINESS
  this.stats.happiness += this._computeHappiness();
  this.stats.happiness = Math.max(0, Math.min(this.stats.happiness, 1));
  console.log('happiness is', this.stats.happiness, '(delta', this._computeHappiness(), ')');

  // PAY STAFF
  this._payStaff('waiter');
};

Antro.prototype.buyAlcohol = function (which) {
  var cost = this.PRICES.alcohol[which];
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

Antro.prototype.hireWaiter = function (who) {
  this.staff.waiter = who;
  console.log('Hired waiter', who);
};

Antro.prototype.availableAlcohol = function (which) {
  return this.alcohol[which] / UNITS_PER_REFILL;
};

Antro.prototype._canAfford = function (cost) {
  return this.stats.money >= cost;
};

Antro.prototype._spend = function (cost) {
  this.stats.money -= Math.round(cost);
};

Antro.prototype._earn = function (amount) {
  this.stats.money += Math.round(amount);
};

Antro.prototype._consumeAlcohol = function (which, amountPerHeavy) {
  var consumed = Math.min(this.alcohol[which],
    amountPerHeavy * this.stats.population);
  var moneyPerUnit = this.EARNINGS.alcohol.normal *
    this.PRICES.alcohol[which] / UNITS_PER_REFILL;

  this.alcohol[which] -= consumed;
  this._earn(moneyPerUnit * consumed);

  if (consumed > 0) {
    this.stats.drunkenness += this.EFFECTS.drunkenness[which];
  }

  console.log('Sold', consumed.toFixed(2), which,
    '+§' + Math.round(moneyPerUnit * consumed));
};

Antro.prototype._payStaff = function (who) {
  var salary;
  if (who === 'waiter') {
    salary = this.PRICES.staff.waiter[this.staff.waiter] / _TICKS_PER_MONTH;
    this._spend(salary);
    who = this.staff.waiter + ' ' + who;
  }
  console.log('Paid', who +'. -§' + Math.round(salary));
};

Antro.prototype._soberUp = function () {
  this.stats.drunkenness += this.EFFECTS.drunkenness.base;
};

Antro.prototype._computeHappiness = function () {
  var base = this.EFFECTS.happiness.base;

  var drinkingLevel;
  if (this.stats.drunkenness < 0.3) {
    drinkingLevel = 'low';
  }
  else if (this.stats.drunkenness < 0.8) {
    drinkingLevel = 'mid';
  }
  else {
    drinkingLevel = 'high';
  }

  var delta = this.EFFECTS.happiness.drinking[drinkingLevel] * base;

  return delta;
};

module.exports = Antro;
