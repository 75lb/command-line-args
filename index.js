var detect = require('feature-detect-es6')

if (!detect.newArrayFeatures()) {
  require('core-js/es6/array')
}

if (detect.all('class', 'arrowFunction')) {
  module.exports = require('./src/lib/command-line-args')
} else {
  module.exports = require('./es5/lib/command-line-args')
}
