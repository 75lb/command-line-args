'use strict'
var TestRunner = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var optionDefinitions = [
  { name: 'one', type: Number }
]

var runner = new TestRunner()

runner.test('type-number: different values', function () {
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', '1' ]),
    { one: 1 }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one' ]),
    { one: null }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', '-1' ]),
    { one: -1 }
  )
  var result = cliArgs(optionDefinitions, [ '--one', 'asdf' ])
  a.ok(isNaN(result.one))
})
