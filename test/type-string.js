'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var optionDefinitions = [
  { name: 'one', type: String }
]

test('type-string: different values', function () {
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'yeah' ]),
    { one: 'yeah' }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one' ]),
    { one: null }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', '3' ]),
    { one: '3' }
  )
})

/* currently not supported, it would complain --yeah is an invalid option */
test.skip('type-string: pass a value resembling an option', function () {
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', '--yeah' ]),
    { one: '--yeah' }
  )
})
