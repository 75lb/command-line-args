'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

test('default value', function () {
  a.deepStrictEqual(cliArgs([ { name: 'one' }, { name: 'two', defaultValue: 'two' } ], [ '--one', '1' ]), {
    one: '1',
    two: 'two'
  })
  a.deepStrictEqual(cliArgs([{ name: 'two', defaultValue: 'two' }], []), {
    two: 'two'
  })
  a.deepStrictEqual(cliArgs([{ name: 'two', defaultValue: 'two' }], [ '--two', 'zwei' ]), {
    two: 'zwei'
  })
  a.deepStrictEqual(
    cliArgs([{ name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }], [ '--two', 'duo' ]),
    { two: [ 'duo' ] }
  )
})

test('default value', function () {
  var defs = [{ name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }]
  var result = cliArgs(defs, [])
  a.deepStrictEqual(result, { two: [ 'two', 'zwei' ] })
})

test('default value: array as defaultOption', function () {
  var defs = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'], defaultOption: true }
  ]
  var argv = [ 'duo' ]
  a.deepStrictEqual(cliArgs(defs, argv), { two: [ 'duo' ] })
})

test('default value: falsy default values', function () {
  var defs = [
    { name: 'one', defaultValue: 0 },
    { name: 'two', defaultValue: false }
  ]

  var argv = []
  a.deepStrictEqual(cliArgs(defs, argv), {
    one: 0,
    two: false
  })
})
