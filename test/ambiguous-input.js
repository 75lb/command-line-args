'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('ambiguous input: value looks like option', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, [ '-c', 'red' ]), {
    colour: 'red'
  })
  a.throws(function () {
    commandLineArgs(optionDefinitions, [ '--colour', '--red' ])
  })
  a.doesNotThrow(function () {
    commandLineArgs(optionDefinitions, [ '--colour=--red' ])
  })
  a.deepStrictEqual(commandLineArgs(optionDefinitions, [ '--colour=--red' ]), {
    colour: '--red'
  })
})
