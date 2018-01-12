'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.skip('throw on unknown value: simple', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = [ '--one', 'arg1', 'arg2' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv, strictValues: true }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === 'arg2'
  )
})

runner.skip('throw on unknown value: defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true }
  ]
  const argv = [ 'arg1', 'arg2' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv, strictValues: true }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === 'arg2'
  )
})

runner.skip('throw on unknown value: multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true, multiple: true }
  ]
  const argv = [ 'arg1', 'arg2' ]
  a.doesNotThrow(() => {
    commandLineArgs(optionDefinitions, { argv, strictValues: true })
  })
})
