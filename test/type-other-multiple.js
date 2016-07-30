'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

var optionDefinitions = [
  { name: 'file', multiple: true, type: function (file) {
    return file
  }}
]

test('type-other-multiple: different values', function () {
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--file', 'one.js' ]),
    { file: [ 'one.js' ] }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--file', 'one.js', 'two.js' ]),
    { file: [ 'one.js', 'two.js' ] }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--file' ]),
    { file: [] }
  )
})
