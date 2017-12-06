'use strict'
const TestRunner = require('test-runner')
const a = require('assert')
const Argv = require('../../lib/argv-array')
const optionUtil = require('../../lib/option-util')

const runner = new TestRunner()

runner.test('.expandOptionEqualsNotation()', function () {
  const argv = new Argv()
  argv.load([ '--one=1', '--two', '2', '--three=3', '4' ])
  argv.expandOptionEqualsNotation()
  a.deepEqual(argv, [
    '--one', optionUtil.VALUE_MARKER + '1', '--two', '2', '--three', optionUtil.VALUE_MARKER + '3', '4'
  ])
})

runner.test('.expandGetoptNotation()', function () {
  const argv = new Argv()
  argv.load([ '-abc' ])
  argv.expandGetoptNotation()
  a.deepEqual(argv.slice(), [
    '-a', '-b', '-c'
  ])
})

runner.test('.expandGetoptNotation() with values', function () {
  const argv = new Argv()
  argv.load([ '-abc', '1', '-a', '2', '-bc' ])
  argv.expandGetoptNotation()
  a.deepEqual(argv, [
    '-a', '-b', '-c', '1', '-a', '2', '-b', '-c'
  ])
})

runner.test('expandOptionEqualsNotation', function () {
  const argv = new Argv()
  argv.load([ '--one=tree' ])
  argv.expandOptionEqualsNotation()
  a.deepEqual(argv, [ '--one', optionUtil.VALUE_MARKER + 'tree' ])
})
