'use strict'
var TestRunner = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var runner = new TestRunner()

var optionDefinitions = [
  { name: 'one' },
  { name: 'two' }
]

runner.test('name: no argv values', function () {
  var argv = []
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {})
})

runner.test('name: just names, no values', function () {
  var argv = [ '--one', '--two' ]
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: true,
    two: true
  })
})

runner.test('name: just names, no values, unpassed value', function () {
  var argv = [ '--one', '--two' ]
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: true,
    two: true
  })
})

runner.test('name: just names, one value, one unpassed value', function () {
  var argv = [ '--one', 'one', '--two' ]
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: 'one',
    two: true
  })
})

runner.test('name: just names, two values', function () {
  var argv = [ '--one', 'one', '--two', 'two' ]
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: 'one',
    two: 'two'
  })
})
