'use strict'
const TestRunner = require('test-runner')
const commandLineArgs = require('../')
const a = require('assert')

const runner = new TestRunner()

runner.test('multiple: disable greedy multiple', function () {
  const argv = ['--one', 'a', '--one', 'b', 'c', '--one', 'd']
  const optionDefinitions = [
      { name: 'one', lazyMultiple: true }
  ]
  const result = commandLineArgs(optionDefinitions, { argv, partial: true })
  a.deepStrictEqual(result, { one: ['a', 'b', 'd'], _unknown: ['c'] })
})
