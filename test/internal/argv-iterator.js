'use strict'
const TestRunner = require('test-runner')
const a = require('assert')
const ArgvIterator = require('../../lib/argv-iterator')

const runner = new TestRunner()

runner.test('argv-iterator: simple', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'three', type: Boolean }
  ]

  const argv = [ '--one', 'arg1', 'arg2', '--two', '--three', 'arg3' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'one', null ],
    [ 'one', 'arg1' ],
    [ '_unknown', 'arg2' ],
    [ 'two', null ],
    [ 'three', true ],
    [ '_unknown', 'arg3' ]
  ])
})

runner.test('argv-iterator: simple, --option=value', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'three', type: Boolean }
  ]

  const argv = [ '--one=arg1', 'arg2', '--two', '--three', 'arg3' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'one', 'arg1' ],
    [ '_unknown', 'arg2' ],
    [ 'two', null ],
    [ 'three', true ],
    [ '_unknown', 'arg3' ]
  ])
})

runner.test('argv-iterator: simple, --option=', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'three', type: Boolean }
  ]

  const argv = [ '--one=' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'one', '' ]
  ])
})

runner.test('argv-iterator: simple 2', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean },
    { name: 'two' },
    { name: 'files', defaultOption: true, multiple: true }
  ]
  const argv = [ 'file0', '--one', 'file1', '--files', 'file2', '--two', '2', 'file3' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'files', 'file0' ],
    [ 'one', true ],
    [ 'files', 'file1' ],
    [ 'files', null ],
    [ 'files', 'file2' ],
    [ 'two', null ],
    [ 'two', '2' ],
    [ 'files', 'file3' ]
  ])
})

runner.test('argv-iterator: --option=value, -getopt', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, alias: 'o' },
    { name: 'two', alias: 't' },
    { name: 'files', defaultOption: true, multiple: true }
  ]
  const argv = [ 'file0', '--one', 'file1', '--files=file2', '--two=2', 'file3', '-ot' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'files', 'file0' ],
    [ 'one', true ],
    [ 'files', 'file1' ],
    [ 'files', 'file2' ],
    [ 'two', '2' ],
    [ 'files', 'file3' ],
    [ 'one', true ],
    [ 'two', null ]
  ])
})

runner.test('argv-iterator: unknown --option=value, -getopt', function () {
  const optionDefinitions = []
  const argv = [ '--files=file2', '-ot' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ '_unknown', '--files=file2' ],
    [ '_unknown', '-o' ],
    [ '_unknown', '-t' ]
  ])
})

runner.test('argv-iterator: unknown --option=value, -getopt 2', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, alias: 'o' }
  ]
  const argv = [ '--files=file2', '-ot' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ '_unknown', '--files=file2' ],
    [ 'one', true ],
    [ '_unknown', '-t' ]
  ])
})

runner.test('argv-iterator: unknown option', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]

  const argv = [ '--two', 'arg1', '--one', 'arg2', 'arg3', '--three' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ '_unknown', '--two' ],
    [ '_unknown', 'arg1' ],
    [ 'one', null ],
    [ 'one', 'arg2' ],
    [ '_unknown', 'arg3' ],
    [ '_unknown', '--three' ]
  ])
})

runner.test('argv-iterator: simple, defaultOption', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'three', type: Boolean },
    { name: 'four', defaultOption: true }
  ]

  const argv = [ '--one', 'arg1', 'arg2', '--two', '--three', 'arg3' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'one', null ],
    [ 'one', 'arg1' ],
    [ 'four', 'arg2' ],
    [ 'two', null ],
    [ 'three', true ],
    [ 'four', 'arg3' ]
  ])
})

runner.test('argv-iterator: multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'files', type: String, defaultOption: true, multiple: true }
  ]
  const argv = [ '--files', 'file1', '--one', 'file2' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'files', null ],
    [ 'files', 'file1' ],
    [ '_unknown', '--one' ],
    [ 'files', 'file2' ]
  ])
})

runner.test('strict mode (throw on unknown value): defaultOption does not throw', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true }
  ]
  const argv = [ 'arg1', 'arg2' ]
  let iterator = new ArgvIterator(optionDefinitions, { argv, strict: false })
  a.doesNotThrow(() => {
    Array.from(iterator)
  })
})

runner.test('strict mode (throw on unknown value): simple', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = [ '--one', 'arg1', 'arg2' ]
  let iterator = new ArgvIterator(optionDefinitions, { argv, strict: false })
  a.doesNotThrow(() => {
    Array.from(iterator)
  })
  iterator = new ArgvIterator(optionDefinitions, { argv, strict: true })
  a.throws(() => {
    Array.from(iterator)
  })
})

runner.test('multiple: greedy on', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ]

  const argv = [ '--one', 'arg1', 'arg2' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'one', null ],
    [ 'one', 'arg1' ],
    [ 'one', 'arg2' ]
  ])
})

runner.test('multiple: greedy off', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true, greedy: false }
  ]

  const argv = [ '--one', 'arg1', 'arg2' ]
  const iterator = new ArgvIterator(optionDefinitions, { argv })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'one', null ],
    [ 'one', 'arg1' ],
    [ '_unknown', 'arg2' ]
  ])
})

runner.test('stopParsingAtFirstUnknown', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean },
    { name: 'two', type: Boolean }
  ]
  const argv = [ '--one', 'a', '--two' ]

  const iterator = new ArgvIterator(optionDefinitions, { argv, stopParsingAtFirstUnknown: true })
  const result = Array.from(iterator)
  a.deepStrictEqual(result, [
    [ 'one', true ],
    [ '_unknown', 'a' ],
    [ '_unknown', '--two' ]
  ])
})
