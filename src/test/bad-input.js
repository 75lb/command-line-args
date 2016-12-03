'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

runner.test('bad-input: handles missing option value', function () {
  const optionDefinitions = [
    { name: 'colour', type: String },
    { name: 'files' }
  ]
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '--colour' ]), {
    colour: null
  })
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '--colour', '--files', 'yeah' ]), {
    colour: null,
    files: 'yeah'
  })
})

runner.test('bad-input: handles arrays with relative paths', function () {
  const optionDefinitions = [
    { name: 'colours', type: String, multiple: true }
  ]
  const argv = [ '--colours', '../what', '../ever' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    colours: [ '../what', '../ever' ]
  })
})
