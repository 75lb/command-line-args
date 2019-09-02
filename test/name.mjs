import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('name')

tom.test('name-unicode: unicode names and aliases are permitted', function () {
  const optionDefinitions = [
    { name: 'один' },
    { name: '两' },
    { name: 'три', alias: 'т' }
  ]
  const argv = [ '--один', '1', '--两', '2', '-т', '3' ]
  const result = commandLineArgs(optionDefinitions, { argv })
  a.strictEqual(result.один, '1')
  a.strictEqual(result.两, '2')
  a.strictEqual(result.три, '3')
})

tom.test('name-alias-mix: one of each', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' },
    { name: 'three', alias: 'h' },
    { name: 'four', alias: 'f' }
  ]
  const argv = [ '--one', '-t', '--three' ]
  const result = commandLineArgs(optionDefinitions, { argv })
  a.strictEqual(result.one, null)
  a.strictEqual(result.two, null)
  a.strictEqual(result.three, null)
  a.strictEqual(result.four, undefined)
})

export default tom
