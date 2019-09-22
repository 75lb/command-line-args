import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('multiple-lazy')

tom.test('string', function () {
  const argv = ['--one', 'a', '--one', 'b', '--one', 'd']
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ]
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['a', 'b', 'd']
  })
})

tom.test('string unset with defaultValue', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true, defaultValue: 1 }
  ]
  const argv = []
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, { one: [1] })
})

tom.test('string, --option=value', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ]
  const argv = ['--one=1', '--one=2']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['1', '2']
  })
})

tom.test('string, --option=value mix', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ]
  const argv = ['--one=1', '--one=2', '--one', '3']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['1', '2', '3']
  })
})

tom.test('string, defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true, defaultOption: true }
  ]
  const argv = ['1', '2']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['1', '2']
  })
})

tom.test('greedy style, string', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ]
  const argv = ['--one', '1', '2']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === '2'
  )
})

tom.test('greedy style, string, --option=value', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ]
  const argv = ['--one=1', '--one=2']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['1', '2']
  })
})

tom.test('greedy style, string, --option=value mix', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ]
  const argv = ['--one=1', '--one=2', '3']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === '3'
  )
})

export default tom
