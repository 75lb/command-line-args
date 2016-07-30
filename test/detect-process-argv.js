'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

test('detect process.argv: should automatically remove first two argv items', function () {
  process.argv = [ 'node', 'filename', '--one', 'eins' ]
  a.deepStrictEqual(cliArgs({ name: 'one' }, process.argv), {
    one: 'eins'
  })
})

test('process.argv is left untouched', function () {
  process.argv = [ 'node', 'filename', '--one', 'eins' ]
  a.deepStrictEqual(cliArgs({ name: 'one' }), {
    one: 'eins'
  })
  a.deepStrictEqual(process.argv, [ 'node', 'filename', '--one', 'eins' ])
})
