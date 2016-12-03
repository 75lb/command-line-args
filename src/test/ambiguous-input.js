'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

runner.test('ambiguous input: value looks like option', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '-c', 'red' ]), {
    colour: 'red'
  })
  a.throws(function () {
    cliArgs(optionDefinitions, [ '--colour', '--red' ]), {
      colour: '--red'
    }
  })
  a.doesNotThrow(function () {
    cliArgs(optionDefinitions, [ '--colour=--red' ]), {
      colour: '--red'
    }
  })
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '--colour=--red' ]), {
    colour: '--red'
  })
})

runner.test('ambiguous input: value uses marker character', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '--colour=--вы' ]), {
    colour: '--вы'
  })
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '--colour=вы' ]), {
    colour: 'вы'
  })
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '--colour', 'вы' ]), {
    colour: 'вы'
  })
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '-c', 'вы' ]), {
    colour: 'вы'
  })
})
