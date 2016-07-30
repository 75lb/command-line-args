'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var optionDefinitions = [
  { name: 'one', type: Boolean }
]

test('type-boolean: different values', function () {
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'true' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'false' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'sfsgf' ]),
    { one: true }
  )
})
