'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const optionDefinitions = [
  { name: 'one', type: Number }
]

const runner = new TestRunner()

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
  const result = cliArgs(optionDefinitions, [ '--one', 'asdf' ])
  a.ok(isNaN(result.one))
})
