'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('unknown option: simple', function () {
  const definitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = [ '--two', 'two', '--one', 'two' ]
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    one: true,
    _unknown: [ '--two', 'two', 'two' ]
  })
})

runner.test('unknown option: defaultOption', function () {
  const definitions = [
    { name: 'files', type: String, defaultOption: true, multiple: true }
  ]
  const argv = [ '--files', 'file1', '--one', 'file2' ]
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: [ 'file1', 'file2' ],
    _unknown: [ '--one' ]
  })
})

runner.test('unknown option: defaultOption 2', function () {
  const definitions = [
    { name: 'files', type: String, defaultOption: true, multiple: true },
    { name: 'one', type: Boolean },
    { name: 'two', alias: 't', defaultValue: 2 },
  ]
  const argv = [ 'file1', '--one', 'file2', '-t', '--two=3', 'file3', '-ab' ]
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: [ 'file1', 'file2', 'file3' ],
    two: '3',
    one: true,
    _unknown: [ '-a', '-b' ]
  })
})

runner.test('unknown option: groups')

runner.test('unknown option: multiple', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true }
  ]
  const argv = [ 'file1', '--files', 'file2', '-t', '--two=3', 'file3', '-ab', '--files=file4' ]
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: [ 'file2', 'file4' ],
    _unknown: [ 'file1', '-t', '--two', '3', 'file3', '-a', '-b' ]
  })
})
