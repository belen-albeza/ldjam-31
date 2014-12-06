'use strict';

var MIN_POPULATION = 1;
var MAX_POPULATION = 100;
var UNITS_PER_REFILL = 500;

var BRAWL_BASE_ODD = 0.05;

var _TICKS_PER_MONTH;
var _game;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function Antro(game, ticksPerMonth) {
  _game = game;
  _TICKS_PER_MONTH = ticksPerMonth;

  this.stats = {
    happiness: 0.4,
    drunkenness: 0,
    money : 9999,
    population: MIN_POPULATION
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
    wine: 0.5,
    vodka: 0.2
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
  },

  population: {
    base: 0.01 * MAX_POPULATION,
    happiness: {
      low: -0.5,
      mid: 1,
      high: 1.5
    },
    random: {
      min: -3,
      max: 1
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
  // compute changes
  this._tickAlcohol();
  this._tickHappiness();
  this._tickPopulation();
  this._tickBrawls();

  // apply costs
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

Antro.prototype.getStatLevel = function (stat) {
  var level;

  if (stat < 0.3) {
    level = 'low';
  }
  else if (stat < 0.8) {
    level = 'mid';
  }
  else {
    level = 'high';
  }

  return level;
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

Antro.prototype._tickAlcohol = function () {
  // consume drinks
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
  this.stats.drunkenness = clamp(this.stats.drunkenness, 0, 1);
};

Antro.prototype._tickHappiness = function () {
  this.stats.happiness += this._computeHappiness();
  this.stats.happiness = clamp(this.stats.happiness, 0, 1);
  console.log('happiness is', this.stats.happiness,
    '(delta', this._computeHappiness(), ')');
};

Antro.prototype._tickPopulation = function () {
  var populationDelta = this._computePopulation();
  this.stats.population += populationDelta;
  this.stats.population =
    clamp(this.stats.population, MIN_POPULATION, MAX_POPULATION);
  console.log('population is', this.stats.population,
    '(delta', populationDelta, ')');
};

Antro.prototype._tickBrawls = function () {
  if (this._shallBrawlHappen()) {
    // TODO: add bouncer mitigation
    var gravity = _game.rnd.realInRange(0.7, 3) * this.stats.population;

    var fine = Math.round(100 * gravity);
    console.log('Brawl: fined with §' + fine);
    this._spend(fine);

    this.stats.happiness = 0;
    console.log('Brawl: happiness reduced to', this.stats.happiness);

    this.stats.population = MIN_POPULATION;
    console.log('Brawl: population reduced to', this.stats.population);

    window.alert(
      'Brawl! Watch out the drunkenness level!\nThe police fined you §' + fine);
  }
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
  var drinkingLevel = this.getStatLevel(this.stats.drunkenness);
  var delta = this.EFFECTS.happiness.drinking[drinkingLevel] * base;

  return delta;
};

Antro.prototype._computePopulation = function () {
  var enoughHappiness = function (level, population) {
    return population < 0.5 * MAX_POPULATION || level === 'high';
  };

  var base = this.EFFECTS.population.base;

  var randomDelta = base * _game.rnd.realInRange(
    this.EFFECTS.population.random.min, this.EFFECTS.population.random.max);

  var happinessLevel = this.getStatLevel(this.stats.happiness);

  // only allow population go up 50% if we have high happiness
  var happinessDelta = base * this.EFFECTS.population.happiness[happinessLevel];
  happinessDelta = (happinessDelta < 0 ||
                    enoughHappiness(happinessLevel, this.stats.population)) ?
    happinessDelta : 0;

  var delta = randomDelta + happinessDelta;
  return delta;
};

Antro.prototype._shallBrawlHappen = function() {
  var enoughHeavies = (this.stats.population >= 0.05 * MAX_POPULATION);
  var odds = ((this.stats.population + this.stats.drunkenness * 100) / (2 * 100)) *
    BRAWL_BASE_ODD;

  console.log('brawl odds are', odds);

  return enoughHeavies && _game.rnd.realInRange(0, 1) <= odds;
};


module.exports = Antro;
