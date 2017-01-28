'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('bad-input: handles missing option value', function () {
  const definitions = [
    { name: 'colour', type: String },
    { name: 'files' }
  ]
  a.deepStrictEqual(commandLineArgs(definitions, { argv: [ '--colour' ] }), {
    colour: null
  })
  a.deepStrictEqual(commandLineArgs(definitions, { argv: [ '--colour', '--files', 'yeah' ] }), {
    colour: null,
    files: 'yeah'
  })
})

runner.test('bad-input: handles arrays with relative paths', function () {
  const definitions = [
    { name: 'colours', type: String, multiple: true }
  ]
  const argv = [ '--colours', '../what', '../ever' ]
  a.deepStrictEqual(commandLineArgs(definitions, { argv }), {
    colours: [ '../what', '../ever' ]
  })
})
