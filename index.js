var detect = require('feature-detect-es6')

module.exports = detect.class() && detect.arrowFunction() && detect.newArrayFeatures()
  ? require('./lib/command-line-args')
  : require('./es5/command-line-args')
