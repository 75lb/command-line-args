'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.skip('unknown option: simple', function () {
  const definitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = [ '--two', 'two', '--one', 'two' ]
  const options = commandLineArgs.partial(definitions, argv)
  a.deepStrictEqual(options, {
    known: {
      one: true
    },
    unknown: [ '--two', 'two', 'two' ]
  })
})
