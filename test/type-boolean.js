'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

test('type-boolean: different values', function () {
  var optionDefinitions = [
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

var origBoolean = Boolean

/* test in contexts which override the standard global Boolean constructor */
test('type-boolean: global Boolean overridden', function () {
  function Boolean () {
    return origBoolean.apply(origBoolean, arguments)
  }

  var optionDefinitions = [
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
