'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('type-other: different values', function () {
  const optionDefinitions = [
    {
      name: 'file',
      type: function (file) {
        return file
      }
    }
  ]

  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--file', 'one.js' ]),
    { file: 'one.js' }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, [ '--file' ]),
    { file: null }
  )
})

runner.test('type-other: broken custom type function', function () {
  const optionDefinitions = [
    {
      name: 'file',
      type: function (file) {
        lasdfjsfakn // eslint-disable-line
      }
    }
  ]
  a.throws(function () {
    commandLineArgs(optionDefinitions, [ '--file', 'one.js' ])
  })
})
