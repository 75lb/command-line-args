import TestRunner from 'test-runner'
import commandLineArgs from '../index.js'
import a from 'assert'

const tom = new TestRunner.Tom('type-number')

tom.test('different values', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', '1'] }),
    { one: 1 }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one'] }),
    { one: null }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', '-1'] }),
    { one: -1 }
  )
  const result = commandLineArgs(optionDefinitions, { argv: ['--one', 'asdf'] })
  a.ok(isNaN(result.one))
})

tom.test('number multiple: 1', function () {
  const optionDefinitions = [
    { name: 'array', type: Number, multiple: true }
  ]
  const argv = ['--array', '1', '2', '3']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    array: [1, 2, 3]
  })
  a.notDeepStrictEqual(result, {
    array: ['1', '2', '3']
  })
})

tom.test('number multiple: 2', function () {
  const optionDefinitions = [
    { name: 'array', type: Number, multiple: true }
  ]
  const argv = ['--array', '1', '--array', '2', '--array', '3']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    array: [1, 2, 3]
  })
  a.notDeepStrictEqual(result, {
    array: ['1', '2', '3']
  })
})

export default tom
