import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('bad-input: empty string', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = [ '--one', '' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: ''
  })
})

runner.test('bad-input: empty string, option cluster', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o', type: Boolean },
    { name: 'two', alias: 't' }
  ]
  const argv = [ '-ot', '' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: true,
    two: ''
  })
})

runner.test('bad-input: empty string, --option=', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = [ '--one=' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: ''
  })
})

runner.test('bad-input: empty string unknown value', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = [ '--one', '' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    /UNKNOWN_VALUE/
  )
})

runner.test('bad-input: empty string added to unknown values', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = [ '--one', '' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv, partial: true }), {
    one: true,
    _unknown: [ '' ]
  })
})
