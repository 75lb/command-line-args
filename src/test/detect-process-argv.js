'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

runner.test('detect process.argv: should automatically remove first two argv items', function () {
  process.argv = [ 'node', 'filename', '--one', 'eins' ]
  a.deepStrictEqual(cliArgs({ name: 'one' }, process.argv), {
    one: 'eins'
  })
})

runner.test('process.argv is left untouched', function () {
  process.argv = [ 'node', 'filename', '--one', 'eins' ]
  a.deepStrictEqual(cliArgs({ name: 'one' }), {
    one: 'eins'
  })
  a.deepStrictEqual(process.argv, [ 'node', 'filename', '--one', 'eins' ])
})
