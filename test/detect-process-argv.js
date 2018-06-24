'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('detect process.argv: should automatically remove first two argv items', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  process.argv = [ 'node', 'filename', '--one', 'eins' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions), {
    one: 'eins'
  })
})

runner.test('detect process.argv: should automatically remove first two argv items 2', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  process.argv = [ 'node', 'filename', '--one', 'eins' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: process.argv }), {
    one: 'eins'
  })
})

runner.test('process.argv is left untouched', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  process.argv = [ 'node', 'filename', '--one', 'eins' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions), {
    one: 'eins'
  })
  a.deepStrictEqual(process.argv, [ 'node', 'filename', '--one', 'eins' ])
})
