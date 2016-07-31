'use strict'
var test = require('test-runner')
var cliArgs = require('../')
var a = require('core-assert')

test('type-other: different values', function () {
  var optionDefinitions = [
    { name: 'file', type: function (file) {
      return file
    }}
  ]

  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--file', 'one.js' ]),
    { file: 'one.js' }
  )
  a.deepStrictEqual(
    cliArgs(optionDefinitions, [ '--file' ]),
    { file: null }
  )
})

test('type-other: broken custom type function', function () {
  var optionDefinitions = [
    { name: 'file', type: function (file) {
      lasdfjsfakn
    }}
  ]
  a.throws(function () {
    cliArgs(optionDefinitions, [ '--file', 'one.js' ])
  })
})
