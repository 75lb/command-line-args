'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../../')
const a = require('assert')

const runner = new TestRunner()

runner.test('ambiguous input: value looks like option 1', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: [ '-c', 'red' ] }), {
    colour: 'red'
  })
})

runner.test('ambiguous input: value looks like option 2', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.throws(function () {
    commandLineArgs(optionDefinitions, { argv: [ '--colour', '--red' ] })
  })
})

runner.test('ambiguous input: value looks like option 3', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.doesNotThrow(function () {
    commandLineArgs(optionDefinitions, { argv: [ '--colour=--red' ] })
  })
})

runner.test('ambiguous input: value looks like option 4', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: [ '--colour=--red' ] }), {
    colour: '--red'
  })
})
