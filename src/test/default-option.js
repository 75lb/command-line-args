'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const runner = new TestRunner()

runner.test('defaultOption: string', function () {
  const optionDefinitions = [
    { name: 'files', defaultOption: true }
  ]
  const argv = [ 'file1', 'file2' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    files: 'file2'
  })
})

runner.test('defaultOption: multiple string', function () {
  const optionDefinitions = [
    { name: 'files', defaultOption: true, multiple: true }
  ]
  const argv = [ 'file1', 'file2' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    files: [ 'file1', 'file2' ]
  })
})

runner.test('defaultOption: after a boolean', function () {
  const definitions = [
    { name: 'one', type: Boolean },
    { name: 'two', defaultOption: true }
  ]
  a.deepStrictEqual(
    cliArgs(definitions, [ '--one', 'sfsgf' ]),
    { one: true, two: 'sfsgf' }
  )
})

runner.test('defaultOption: multiple defaultOption values between other arg/value pairs', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'files', defaultOption: true, multiple: true }
  ]
  const argv = [ '--one', '1', 'file1', 'file2', '--two', '2' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    one: '1',
    two: '2',
    files: [ 'file1', 'file2' ]
  })
})

runner.test('defaultOption: multiple defaultOption values between other arg/value pairs 2', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean },
    { name: 'two' },
    { name: 'files', defaultOption: true, multiple: true }
  ]
  const argv = [ 'file0', '--one', 'file1', '--files', 'file2', '--two', '2', 'file3' ]
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    one: true,
    two: '2',
    files: [ 'file0', 'file1', 'file2', 'file3' ]
  })
})

runner.test('defaultOption: floating args present but no defaultOption', function () {
  const definitions = [
    { name: 'one', type: Boolean }
  ]
  a.deepStrictEqual(
    cliArgs(definitions, [ 'aaa', '--one', 'aaa', 'aaa' ]),
    { one: true }
  )
})
