'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const optionDefinitions = [
  { name: 'file', multiple: true, type: function (file) {
    return file
  }}
]

const runner = new TestRunner()

runner.test('type-other-multiple: different values', function () {
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
