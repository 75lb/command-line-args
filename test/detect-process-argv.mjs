import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('detect-process-argv')

tom.test('should automatically remove first two argv items', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs(optionDefinitions), {
    one: 'eins'
  })
})

tom.test('should automatically remove first two argv items 2', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: process.argv }), {
    one: 'eins'
  })
})

tom.test('process.argv is left untouched', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs(optionDefinitions), {
    one: 'eins'
  })
  a.deepStrictEqual(process.argv, ['node', 'filename', '--one', 'eins'])
})

export default tom
