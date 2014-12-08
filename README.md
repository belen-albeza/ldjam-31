# Ludum Dare #31

This is my entry for [Ludum Dare #31](http://ludumdare.com/), a 48-hour solo game development jam.

## Play!

[Play the game here](http://lab.belenalbeza.com/games/ldjam-31/).

## Development

**Requirements**:

 - Node and npm
 - Gulp `npm install -g gulp`

To install required Node modules, run:

 ```
 npm install
 ```

Gulp is being used to run browserify, lint the code and bundle a release.

To run the game within a local server:

```
gulp
```

To build a release:

```
gulp dist
```

To deploy to an external server, rename `gulp.config.json.template` to `gulp.config.json` and edit the values according to your setup. Then:

```
gulp deploy
```

## License

© 2014 Belén "Benko" Albeza

Unless otherwise stated, this game is published under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license. See `LICENSE` for details.
