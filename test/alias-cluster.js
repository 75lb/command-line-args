'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('alias-cluster: two flags, one option', function () {
  const optionDefinitions = [
    { name: 'flagA', alias: 'a', type: Boolean },
    { name: 'flagB', alias: 'b', type: Boolean },
    { name: 'three', alias: 'c' }
  ]

  const argv = [ '-abc', 'yeah' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flagA: true,
    flagB: true,
    three: 'yeah'
  })
})

runner.test('alias-cluster: two flags, one option 2', function () {
  const optionDefinitions = [
    { name: 'flagA', alias: 'a', type: Boolean },
    { name: 'flagB', alias: 'b', type: Boolean },
    { name: 'three', alias: 'c' }
  ]

  const argv = [ '-c', 'yeah', '-ab' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flagA: true,
    flagB: true,
    three: 'yeah'
  })
})
