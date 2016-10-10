'use strict'
var TestRunner = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var runner = new TestRunner()

runner.test('err-invalid-definition: throws when no definition.name specified', function () {
  var optionDefinitions = [
    { something: 'one' },
    { something: 'two' }
  ]
  var argv = [ '--one', '--two' ]
  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'NAME_MISSING')
  }
})

runner.test('err-invalid-definition: throws if dev set a numeric alias', function () {
  var optionDefinitions = [
    { name: 'colours', alias: '1' }
  ]
  var argv = [ '--colours', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_ALIAS')
  }
})

runner.test('err-invalid-definition: throws if dev set an alias of "-"', function () {
  var optionDefinitions = [
    { name: 'colours', alias: '-' }
  ]
  var argv = [ '--colours', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_ALIAS')
  }
})

runner.test('err-invalid-definition: multi-character alias', function () {
  var optionDefinitions = [
    { name: 'one', alias: 'aa' }
  ]
  var argv = [ '--one', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'INVALID_ALIAS')
  }
})

runner.test('err-invalid-definition: invalid type values', function () {
  var argv = [ '--one', 'something' ]
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
  var optionDefinitions = [
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
  var optionDefinitions = [
    { name: 'colours' },
    { name: 'colours' }
  ]
  var argv = [ '--colours', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'DUPLICATE_NAME')
  }
})

runner.test('err-invalid-definition: duplicate alias', function () {
  var optionDefinitions = [
    { name: 'one', alias: 'a' },
    { name: 'two', alias: 'a' }
  ]
  var argv = [ '--one', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'DUPLICATE_ALIAS')
  }
})

runner.test('err-invalid-definition: multiple defaultOption', function () {
  var optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two', defaultOption: true }
  ]
  var argv = [ '--one', 'red' ]

  try {
    cliArgs(optionDefinitions, argv)
    a.fail()
  } catch (err) {
    a.strictEqual(err.name, 'DUPLICATE_DEFAULT_OPTION')
  }
})
