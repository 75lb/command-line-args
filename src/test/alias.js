'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

const optionDefinitions = [
  { name: 'verbose', alias: 'v' },
  { name: 'colour', alias: 'c' },
  { name: 'number', alias: 'n' },
  { name: 'dry-run', alias: 'd' }
]

runner.test('alias: one boolean', function () {
  const argv = [ '-v' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    verbose: true
  })
})

runner.test('alias: one --this-type boolean', function () {
  const argv = [ '-d' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    'dry-run': true
  })
})

runner.test('alias: one boolean, one string', function () {
  const argv = [ '-v', '-c' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    verbose: true,
    colour: true
  })
})
