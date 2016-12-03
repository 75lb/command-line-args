'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

runner.test('type-other: different values', function () {
  const optionDefinitions = [
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

runner.test('type-other: broken custom type function', function () {
  const optionDefinitions = [
    { name: 'file', type: function (file) {
      lasdfjsfakn
    }}
  ]
  a.throws(function () {
    cliArgs(optionDefinitions, [ '--file', 'one.js' ])
  })
})
