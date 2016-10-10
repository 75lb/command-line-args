'use strict'
var TestRunner = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var runner = new TestRunner()

var optionDefinitions = [
  { name: 'один' },
  { name: '两' },
  { name: 'три', alias: 'т' }
]

runner.test('name-unicode: unicode names and aliases are permitted', function () {
  var argv = [ '--один', '1', '--两', '2', '-т', '3' ]
  var result = cliArgs(optionDefinitions, argv)
  a.strictEqual(result.один, '1')
  a.strictEqual(result.两, '2')
  a.strictEqual(result.три, '3')
})
