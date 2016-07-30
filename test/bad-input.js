'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

test('bad-input: handles missing option value', function () {
  var optionDefinitions = [
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

test('bad-input: handles arrays with relative paths', function () {
  var optionDefinitions = [
    { name: 'colours', type: String, multiple: true }
  ]
  var argv = [ '--colours', '../what', '../ever' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    colours: [ '../what', '../ever' ]
  })
})
