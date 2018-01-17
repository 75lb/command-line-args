'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('camel-case', function () {
  const optionDefinitions = [
    { name: 'one-two' },
    { name: 'three', type: Boolean }
  ]
  const argv = [ '--one-two', '1', '--three' ]
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true })
  a.deepStrictEqual(result, {
    oneTwo: '1',
    three: true
  })
})
