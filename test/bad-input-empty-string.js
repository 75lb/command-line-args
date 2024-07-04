import TestRunner from 'test-runner'
import commandLineArgs from '../index.js'
import a from 'assert'

const tom = new TestRunner.Tom('bad-input-empty-string')

tom.test('empty string', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = ['--one', '']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: ''
  })
})

tom.test('empty string, option cluster', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o', type: Boolean },
    { name: 'two', alias: 't' }
  ]
  const argv = ['-ot', '']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: true,
    two: ''
  })
})

tom.test('empty string, --option=', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = ['--one=']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: ''
  })
})

tom.test('empty string unknown value', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = ['--one', '']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    /UNKNOWN_VALUE/
  )
})

tom.test('empty string added to unknown values', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = ['--one', '']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv, partial: true }), {
    one: true,
    _unknown: ['']
  })
})

export default tom
