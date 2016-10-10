'use strict'
var TestRunner = require('test-runner')
var detect = require('feature-detect-es6')
var a = require('core-assert')
var Argv
var Definitions

if (detect.all('class', 'arrowFunction', 'newArrayFeatures')) {
  Argv = require('../lib/argv')
  Definitions = require('../lib/definitions')
} else {
  require('core-js/es6/array')
  Argv = require('../es5/argv')
  Definitions = require('../es5/definitions')
}

var runner = new TestRunner()

runner.test('.expandOptionEqualsNotation()', function () {
  var argv = new Argv([ '--one=1', '--two', '2', '--three=3', '4' ])
  argv.expandOptionEqualsNotation()
  a.deepStrictEqual(argv.list, [
    '--one', '1', '--two', '2', '--three', '3', '4'
  ])
})

runner.test('.expandGetoptNotation()', function () {
  var argv = new Argv([ '-abc' ])
  argv.expandGetoptNotation()
  a.deepStrictEqual(argv.list, [
    '-a', '-b', '-c'
  ])
})

runner.test('.expandGetoptNotation() with values', function () {
  var argv = new Argv([ '-abc', '1', '-a', '2', '-bc' ])
  argv.expandGetoptNotation()
  a.deepStrictEqual(argv.list, [
    '-a', '-b', '-c', '1', '-a', '2', '-b', '-c'
  ])
})

runner.test('.validate()', function () {
  var definitions = new Definitions([
    { name: 'one', type: Number }
  ])

  a.doesNotThrow(function () {
    var argv = new Argv([ '--one', '1' ])
    argv.validate(definitions)
  })

  a.throws(function () {
    var argv = new Argv([ '--one', '--two' ])
    argv.validate(definitions)
  })

  a.throws(function () {
    var argv = new Argv([ '--one', '2', '--two', 'two' ])
    argv.validate(definitions)
  })

  a.throws(function () {
    var argv = new Argv([ '-a', '2' ])
    argv.validate(definitions)
  })
})
