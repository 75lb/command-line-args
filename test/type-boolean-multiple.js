'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

const definitions = [
  { name: 'array', type: Boolean, multiple: true }
]

runner.test('type-boolean-multiple: 1', function () {
  const argv = [ '--array', '--array', '--array' ]
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {
    array: [ true, true, true ]
  })
})
