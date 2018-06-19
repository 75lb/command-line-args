'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('alias-whitespace: with space after option', function () {
  const optionDefinitions = [
    { name: 'something', alias: 's' }
  ]
  const argv = [ '-s', 'one' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    something: 'one'
  })
})

runner.test('alias-whitespace: without space after option', function () {
  const optionDefinitions = [
    { name: 'something', alias: 's' }
  ]
  const argv = [ '-sone' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    something: 'one'
  })
})

runner.test('alias-whitespace: with space after option in cluster', function () {
  const optionDefinitions = [
    { name: 'something', alias: 's' },
    { name: 'flag', alias: 'f', type: Boolean }
  ]
  const argv = [ '-fs', 'one' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flag: true,
    something: 'one'
  })
})

runner.test('alias-whitespace: without space after option in cluster', function () {
  const optionDefinitions = [
    { name: 'something', alias: 's' },
    { name: 'flag', alias: 'f', type: Boolean }
  ]
  const argv = [ '-fsone' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flag: true,
    something: 'one'
  })
})
