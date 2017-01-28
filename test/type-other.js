'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('type-other: different values', function () {
  const definitions = [
    {
      name: 'file',
      type: function (file) {
        return file
      }
    }
  ]

  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: [ '--file', 'one.js' ] }),
    { file: 'one.js' }
  )
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: [ '--file' ] }),
    { file: null }
  )
})

runner.test('type-other: broken custom type function', function () {
  const definitions = [
    {
      name: 'file',
      type: function (file) {
        lasdfjsfakn // eslint-disable-line
      }
    }
  ]
  a.throws(function () {
    commandLineArgs(definitions, { argv: [ '--file', 'one.js' ] })
  })
})
