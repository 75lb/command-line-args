'use strict'
const TestRunner = require('test-runner')
const detect = require('feature-detect-es6')
const a = require('core-assert')
const Argv = require('../lib/argv')
const Definitions = require('../lib/definitions')

const runner = new TestRunner()

runner.test('.expandOptionEqualsNotation()', function () {
  const argv = new Argv([ '--one=1', '--two', '2', '--three=3', '4' ])
  argv.expandOptionEqualsNotation()
  a.deepStrictEqual(argv.list, [
    '--one', '552f3a31-14cd-4ced-bd67-656a659e9efb1', '--two', '2', '--three', '552f3a31-14cd-4ced-bd67-656a659e9efb3', '4'
  ])
})

runner.test('.expandGetoptNotation()', function () {
  const argv = new Argv([ '-abc' ])
  argv.expandGetoptNotation()
  a.deepStrictEqual(argv.list, [
    '-a', '-b', '-c'
  ])
})

runner.test('.expandGetoptNotation() with values', function () {
  const argv = new Argv([ '-abc', '1', '-a', '2', '-bc' ])
  argv.expandGetoptNotation()
  a.deepStrictEqual(argv.list, [
    '-a', '-b', '-c', '1', '-a', '2', '-b', '-c'
  ])
})

runner.test('.validate()', function () {
  const definitions = new Definitions([
    { name: 'one', type: Number }
  ])

  a.doesNotThrow(function () {
    const argv = new Argv([ '--one', '1' ])
    argv.validate(definitions)
  })

  a.throws(function () {
    const argv = new Argv([ '--one', '--two' ])
    argv.validate(definitions)
  })

  a.throws(function () {
    const argv = new Argv([ '--one', '2', '--two', 'two' ])
    argv.validate(definitions)
  })

  a.throws(function () {
    const argv = new Argv([ '-a', '2' ])
    argv.validate(definitions)
  })
})

runner.test('expandOptionEqualsNotation', function () {
  const argv = new Argv([ '--one=tree' ])
  argv.expandOptionEqualsNotation()
  a.deepStrictEqual(argv.list, [ '--one', '552f3a31-14cd-4ced-bd67-656a659e9efbtree' ])
})
