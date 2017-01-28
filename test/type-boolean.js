'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('type-boolean: different values', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]

  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--one' ]),
    { one: true }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--one', 'true' ]),
    { one: true }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--one', 'false' ]),
    { one: true }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--one', 'sfsgf' ]),
    { one: true }
  )
})

const origBoolean = Boolean

/* test in contexts which override the standard global Boolean constructor */
runner.test('type-boolean: global Boolean overridden', function () {
  function Boolean () {
    return origBoolean.apply(origBoolean, arguments)
  }

  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]

  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--one', 'true' ]),
    { one: true }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--one', 'false' ]),
    { one: true }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--one', 'sfsgf' ]),
    { one: true }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--one' ]),
    { one: true }
  )
})
