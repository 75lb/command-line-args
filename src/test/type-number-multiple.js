'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const optionDefinitions = [
  { name: 'array', type: Number, multiple: true }
]

const runner = new TestRunner()

runner.test('number multiple: 1', function () {
  const argv = [ '--array', '1', '2', '3' ]
  const result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    array: [ 1, 2, 3 ]
  })
  a.notDeepStrictEqual(result, {
    array: [ '1', '2', '3' ]
  })
})

runner.test('number multiple: 2', function () {
  const argv = [ '--array', '1', '--array', '2', '--array', '3' ]
  const result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    array: [ 1, 2, 3 ]
  })
  a.notDeepStrictEqual(result, {
    array: [ '1', '2', '3' ]
  })
})
