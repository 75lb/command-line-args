'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

const optionDefinitions = [
  { name: 'array', type: Boolean, multiple: true }
]

runner.test('type-boolean-multiple: 1', function () {
  const argv = [ '--array', '--array', '--array' ]
  const result = commandLineArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    array: [ true, true, true ]
  })
})
