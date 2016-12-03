'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

runner.test('err-invalid-definition: throws when no definition.name specified', function () {
  const optionDefinitions = [
    { something: 'one' },
    { something: 'two' }
  ]
  const argv = [ '--one', '--two' ]
  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'NAME_MISSING')
  }
})

runner.test('err-invalid-definition: throws if dev set a numeric alias', function () {
  const optionDefinitions = [
    { name: 'colours', alias: '1' }
  ]
  const argv = [ '--colours', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_ALIAS')
  }
})

runner.test('err-invalid-definition: throws if dev set an alias of "-"', function () {
  const optionDefinitions = [
    { name: 'colours', alias: '-' }
  ]
  const argv = [ '--colours', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_ALIAS')
  }
})

runner.test('err-invalid-definition: multi-character alias', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'aa' }
  ]
  const argv = [ '--one', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_ALIAS')
  }
})

runner.test('err-invalid-definition: invalid type values', function () {
  const argv = [ '--one', 'something' ]
  try {
    cliArgs([ { name: 'one', type: 'string' } ], argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_TYPE')
  }

  try {
    cliArgs([ { name: 'one', type: 234 } ], argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_TYPE')
  }

  try {
    cliArgs([ { name: 'one', type: {} } ], argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_TYPE')
  }

  a.doesNotThrow(function () {
    cliArgs([ { name: 'one', type: function () {} } ], argv)
  }, /invalid/i)
})

runner.test('err-invalid-definition: value without option definition', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]

  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', '1' ]),
    { one: 1 }
  )

  try {
    cliArgs(optionDefinitions, [ '--one', '--two' ])
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'UNKNOWN_OPTION')
  }

  try {
    cliArgs(optionDefinitions, [ '--one', '2', '--two', 'two' ])
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'UNKNOWN_OPTION')
  }

  try {
    cliArgs(optionDefinitions, [ '-a', '2' ])
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'UNKNOWN_OPTION')
  }

  try {
    cliArgs(optionDefinitions, [ '-sdf' ])
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'UNKNOWN_OPTION', 'getOpts')
  }
})

runner.test('err-invalid-definition: duplicate name', function () {
  const optionDefinitions = [
    { name: 'colours' },
    { name: 'colours' }
  ]
  const argv = [ '--colours', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'DUPLICATE_NAME')
  }
})

runner.test('err-invalid-definition: duplicate alias', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'a' },
    { name: 'two', alias: 'a' }
  ]
  const argv = [ '--one', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'DUPLICATE_ALIAS')
  }
})

runner.test('err-invalid-definition: multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two', defaultOption: true }
  ]
  const argv = [ '--one', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'DUPLICATE_DEFAULT_OPTION')
  }
})
