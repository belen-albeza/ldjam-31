'use strict';

module.exports = {
  spawnSprite: function (group, klass, x, y) {
    var instance = group.getFirstExists(false);
    // reuse existing slot if available
    if (instance) {
      instance.reset(x, y);
      if (instance.init) { instance.init(); }
    }
    // if there is not slot available, create a new sprite
    else {
      group.add(new klass(group.game, x, y));
    }
    console.log('spawned', klass, 'at', x, y);
  }
};
