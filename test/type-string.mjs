import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('type-string: different values', function () {
  const optionDefinitions = [
    { name: 'one', type: String }
  ]
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', 'yeah'] }),
    { one: 'yeah' }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one'] }),
    { one: null }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', '3'] }),
    { one: '3' }
  )
})
