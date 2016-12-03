'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

const optionDefinitions = [
  { name: 'array', type: Boolean, multiple: true }
]

runner.test('type-boolean-multiple: 1', function () {
  const argv = [ '--array', '--array', '--array' ]
  const result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    array: [ true, true, true ]
  })
})
