'use strict'
var TestRunner = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var runner = new TestRunner()

var optionDefinitions = [
  { name: 'one', alias: 'o' },
  { name: 'two', alias: 't' },
  { name: 'three', alias: 'h' },
  { name: 'four', alias: 'f' }
]

runner.test('name-alias-mix: one of each', function () {
  var argv = [ '--one', '-t', '--three' ]
  var result = cliArgs(optionDefinitions, argv)
  a.strictEqual(result.one, true)
  a.strictEqual(result.two, true)
  a.strictEqual(result.three, true)
  a.strictEqual(result.four, undefined)
})
