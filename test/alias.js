'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var optionDefinitions = [
  { name: 'verbose', alias: 'v' },
  { name: 'colour', alias: 'c' },
  { name: 'number', alias: 'n' },
  { name: 'dry-run', alias: 'd' }
]

test('alias: one boolean', function () {
  var argv = [ '-v' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    verbose: true
  })
})

test('alias: one --this-type boolean', function () {
  var argv = [ '-d' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    'dry-run': true
  })
})

test('alias: one boolean, one string', function () {
  var argv = [ '-v', '-c' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    verbose: true,
    colour: true
  })
})
