'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('defaultOption: after a boolean', function () {
  const definitions = [
    { name: 'one', type: Boolean },
    { name: 'two', defaultOption: true }
  ]
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: [ '--one', 'sfsgf' ] }),
    { one: true, two: 'sfsgf' }
  )
})

runner.test('defaultOption with value equal to defaultValue', function () {
  const definitions = [
    { name: 'file', defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = [ 'file1' ]
  const options = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(options, {
    file: 'file1'
  })
})

runner.test('string defaultOption can be set by argv once', function () {
  const definitions = [
    { name: 'file', defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = [ '--file', '--file=file2' ]
  const options = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(options, {
    file: 'file2'
  })
})

runner.test('string defaultOption cannot be set by argv twice', function () {
  const definitions = [
    { name: 'file', defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = [ '--file', '--file=file2', 'file3' ]
  a.throws(
    () => commandLineArgs(definitions, { argv }),
    /UNKNOWN_VALUE/
  )
})
