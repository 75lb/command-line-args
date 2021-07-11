import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('name-alias-mix: one of each', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' },
    { name: 'three', alias: 'h' },
    { name: 'four', alias: 'f' }
  ]
  const argv = ['--one', '-t', '--three']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.strictEqual(result.one, null)
  a.strictEqual(result.two, null)
  a.strictEqual(result.three, null)
  a.strictEqual(result.four, undefined)
})
