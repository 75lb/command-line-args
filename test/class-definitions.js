'use strict'
var TestRunner = require('test-runner')
var detect = require('feature-detect-es6')
var a = require('core-assert')
var Definitions

if (detect.all('class', 'arrowFunction', 'newArrayFeatures')) {
  Definitions = require('../lib/definitions')
} else {
  require('core-js/es6/array')
  Definitions = require('../es5/definitions')
}

var runner = new TestRunner()

runner.test('.createOutput()', function () {
  var definitions = new Definitions([ { name: 'one', defaultValue: 'eins' } ])
  a.deepStrictEqual(definitions.createOutput(), { one: 'eins' })
})

runner.test('.get()', function () {
  var definitions = new Definitions([ { name: 'one', defaultValue: 'eins' } ])
  a.strictEqual(definitions.get('--one').name, 'one')
})

runner.test('.validate()', function () {
  a.throws(function () {
    var definitions = new Definitions([ { name: 'one' }, { name: 'one' } ])
  })
})
