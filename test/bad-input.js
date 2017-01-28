'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('bad-input: handles missing option value', function () {
  const optionDefinitions = [
    { name: 'colour', type: String },
    { name: 'files' }
  ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, [ '--colour' ]), {
    colour: null
  })
  a.deepStrictEqual(commandLineArgs(optionDefinitions, [ '--colour', '--files', 'yeah' ]), {
    colour: null,
    files: 'yeah'
  })
})

runner.test('bad-input: handles arrays with relative paths', function () {
  const optionDefinitions = [
    { name: 'colours', type: String, multiple: true }
  ]
  const argv = [ '--colours', '../what', '../ever' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, argv), {
    colours: [ '../what', '../ever' ]
  })
})
