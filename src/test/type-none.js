'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

const optionDefinitions = [
  { name: 'one' },
  { name: 'two' }
]

runner.test('name: no argv values', function () {
  const argv = []
  const result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {})
})

runner.test('name: just names, no values', function () {
  const argv = [ '--one', '--two' ]
  const result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: true,
    two: true
  })
})

runner.test('name: just names, no values, unpassed value', function () {
  const argv = [ '--one', '--two' ]
  const result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: true,
    two: true
  })
})

runner.test('name: just names, one value, one unpassed value', function () {
  const argv = [ '--one', 'one', '--two' ]
  const result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: 'one',
    two: true
  })
})

runner.test('name: just names, two values', function () {
  const argv = [ '--one', 'one', '--two', 'two' ]
  const result = cliArgs(optionDefinitions, argv)
  a.deepStrictEqual(result, {
    one: 'one',
    two: 'two'
  })
})
