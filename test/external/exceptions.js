'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../../')
const a = require('assert')

const runner = new TestRunner()

runner.test('err-invalid-definition: throws when no definition.name specified', function () {
  const optionDefinitions = [
    { something: 'one' },
    { something: 'two' }
  ]
  const argv = [ '--one', '--two' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'NAME_MISSING'
  )
})

runner.test('err-invalid-definition: throws if dev set a numeric alias', function () {
  const optionDefinitions = [
    { name: 'colours', alias: '1' }
  ]
  const argv = [ '--colours', 'red' ]

  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_ALIAS'
  )
})

runner.test('err-invalid-definition: throws if dev set an alias of "-"', function () {
  const optionDefinitions = [
    { name: 'colours', alias: '-' }
  ]
  const argv = [ '--colours', 'red' ]

  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_ALIAS'
  )
})

runner.test('err-invalid-definition: multi-character alias', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'aa' }
  ]
  const argv = [ '--one', 'red' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_ALIAS'
  )
})

runner.test('err-invalid-definition: invalid type values 1', function () {
  const argv = [ '--one', 'something' ]
  a.throws(
    () => commandLineArgs([ { name: 'one', type: 'string' } ], { argv }),
    err => err.name === 'INVALID_TYPE'
  )
})

runner.test('err-invalid-definition: invalid type values 2', function () {
  const argv = [ '--one', 'something' ]
  a.throws(
    () => commandLineArgs([ { name: 'one', type: 234 } ], { argv }),
    err => err.name === 'INVALID_TYPE'
  )
})

runner.test('err-invalid-definition: invalid type values 3', function () {
  const argv = [ '--one', 'something' ]
  a.throws(
    () => commandLineArgs([ { name: 'one', type: {} } ], { argv }),
    err => err.name === 'INVALID_TYPE'
  )
})

runner.test('err-invalid-definition: invalid type values 4', function () {
  const argv = [ '--one', 'something' ]
  a.doesNotThrow(function () {
    commandLineArgs([ { name: 'one', type: function () {} } ], { argv })
  }, /invalid/i)
})

runner.test('err-invalid-definition: value without option definition 1', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: [ '--one', '1' ] }),
    { one: 1 }
  )
})

runner.test('err-invalid-definition: value without option definition 2', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: [ '--one', '--two' ] }),
    err => err.name === 'UNKNOWN_OPTION' && err.invalidOption === '--two'
  )
})

runner.test('err-invalid-definition: value without option definition 3', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: [ '--one', '2', '--two', 'two' ] }),
    err => err.name === 'UNKNOWN_OPTION' && err.invalidOption === '--two'
  )
})

runner.test('err-invalid-definition: value without option definition 4', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: [ '-a', '2' ] }),
    err => err.name === 'UNKNOWN_OPTION' && err.invalidOption === '-a'
  )
})

runner.test('err-invalid-definition: value without option definition 5', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: [ '-sdf' ] }),
    err => err.name === 'UNKNOWN_OPTION' && err.invalidOption === '-s'
  )
})

runner.test('err-invalid-definition: duplicate name', function () {
  const optionDefinitions = [
    { name: 'colours' },
    { name: 'colours' }
  ]
  const argv = [ '--colours', 'red' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'DUPLICATE_NAME'
  )
})

runner.test('err-invalid-definition: duplicate alias', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'a' },
    { name: 'two', alias: 'a' }
  ]
  const argv = [ '--one', 'red' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'DUPLICATE_ALIAS'
  )
})

runner.test('err-invalid-definition: multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two', defaultOption: true }
  ]
  const argv = [ '--one', 'red' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'DUPLICATE_DEFAULT_OPTION'
  )
})

runner.test('err-invalid-defaultOption: defaultOption on a Boolean type')
