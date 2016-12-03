'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const optionDefinitions = [
  { name: 'one', type: String }
]

const runner = new TestRunner()

runner.test('type-string: different values', function () {
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
runner.skip('type-string: pass a value resembling an option', function () {
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', '--yeah' ]),
    { one: '--yeah' }
  )
})
