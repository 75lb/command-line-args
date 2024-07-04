import TestRunner from 'test-runner'
import commandLineArgs from '../index.js'
import a from 'assert'

const tom = new TestRunner.Tom('type-none')

tom.test('no argv values', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' }
  ]
  const argv = []
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {})
})

tom.test('just names, no values', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' }
  ]
  const argv = ['--one', '--two']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: null,
    two: null
  })
})

tom.test('just names, one value, one unpassed value', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' }
  ]
  const argv = ['--one', 'one', '--two']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: 'one',
    two: null
  })
})

tom.test('just names, two values', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' }
  ]
  const argv = ['--one', 'one', '--two', 'two']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: 'one',
    two: 'two'
  })
})

export default tom
