/**
 * Why *both* babel.config.js and .babelrc ?
 *
 * Parcel requires static config files (e.g. .babelrc) in order to be able to
 * cache assets: https://github.com/parcel-bundler/parcel/issues/2110
 *
 * Jest (as of v7) no longer supports .babelrc and now requires babel.config.js:
 * https://github.com/facebook/jest/issues/8365
 * This is really only the case when there are esmodule based dependencies within
 * node_modules.
 *
 * So here we just import the static file and re-export it for jest.
 * Note that our .babelrc file has a *.js extension.  This is to allow for module
 * loading. Parcel doesn't care about this, but be careful not to put any logic
 * into .babelrc
 */

const babelrc = require('./.babelrc.js')

module.exports = babelrc
