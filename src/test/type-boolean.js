'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

runner.test('type-boolean: different values', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]

  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'true' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'false' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'sfsgf' ]),
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
    cliArgs(optionDefinitions, [ '--one', 'true' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'false' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one', 'sfsgf' ]),
    { one: true }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--one' ]),
    { one: true }
  )
})
