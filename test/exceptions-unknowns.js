import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('unknown option', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['--one', '--two'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '--two'
  )
})

tom.test('1 unknown option, 1 unknown value', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['--one', '2', '--two', 'two'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '--two'
  )
})

tom.test('unknown alias', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['-a', '2'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '-a'
  )
})

tom.test('unknown combined aliases', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['-sdf'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '-s'
  )
})

tom.test('unknown value', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = ['--one', 'arg1', 'arg2']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === 'arg2'
  )
})

tom.test('unknown value with singular defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true }
  ]
  const argv = ['arg1', 'arg2']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === 'arg2'
  )
})

tom.test('no unknown value exception with multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true, multiple: true }
  ]
  const argv = ['arg1', 'arg2']
  a.doesNotThrow(() => {
    commandLineArgs(optionDefinitions, { argv })
  })
})

tom.test('non-multiple defaultOption should take first value 2', function () {
  const optionDefinitions = [
    { name: 'file', defaultOption: true },
    { name: 'one', type: Boolean },
    { name: 'two', type: Boolean }
  ]
  const argv = ['--two', 'file1', '--one', 'file2']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === 'file2'
  )
})

export default tom
