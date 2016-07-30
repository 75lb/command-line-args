'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var optionDefinitions = [
  { name: 'one' },
  { name: 'two' }
]

test('name: no argv values', function () {
  var argv = []
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {})
})

test('name: just names, no values', function () {
  var argv = [ '--one', '--two' ]
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: true,
    two: true
  })
})

test('name: just names, no values, unpassed value', function () {
  var argv = [ '--one', '--two' ]
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: true,
    two: true
  })
})

test('name: just names, one value, one unpassed value', function () {
  var argv = [ '--one', 'one', '--two' ]
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: 'one',
    two: true
  })
})

test('name: just names, two values', function () {
  var argv = [ '--one', 'one', '--two', 'two' ]
  var result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: 'one',
    two: 'two'
  })
})
