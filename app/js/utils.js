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
      /*jshint -W055 */
      group.add(new klass(group.game, x, y));
      /*jshint +W055 */
    }
    console.log('spawned', klass, 'at', x, y);
  }
};
