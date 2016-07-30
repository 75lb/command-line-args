'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var optionDefinitions = [
  { name: 'file', type: function (file) {
    return file
  }}
]

test('type-other: different values', function () {
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--file', 'one.js' ]),
    { file: 'one.js' }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--file' ]),
    { file: null }
  )
})
