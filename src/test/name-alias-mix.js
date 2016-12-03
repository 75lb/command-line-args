'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

const optionDefinitions = [
  { name: 'one', alias: 'o' },
  { name: 'two', alias: 't' },
  { name: 'three', alias: 'h' },
  { name: 'four', alias: 'f' }
]

runner.test('name-alias-mix: one of each', function () {
  const argv = [ '--one', '-t', '--three' ]
  const result = cliArgs(optionDefinitions, argv)
  a.strictEqual(result.one, true)
  a.strictEqual(result.two, true)
  a.strictEqual(result.three, true)
  a.strictEqual(result.four, undefined)
})
