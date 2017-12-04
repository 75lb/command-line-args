'use strict'
const TestRunner = require('test-runner')
const Option = require('../../lib/option')
const a = require('assert')

const runner = new TestRunner()

runner.test('option.set(): simple set string', function () {
  const option = Option.create({ name: 'two' })
  a.strictEqual(option.get(), null)
  a.strictEqual(option.valueSource, 'default')
  option.set('zwei')
  a.strictEqual(option.get(), 'zwei')
  a.strictEqual(option.valueSource, 'argv')
  option.set('drei')
  a.strictEqual(option.get(), 'drei')
  a.strictEqual(option.valueSource, 'argv')
})

runner.test('option.set(): simple set boolean', function () {
  const option = Option.create({ name: 'two', type: Boolean })
  a.strictEqual(option.get(), null)
  a.strictEqual(option.valueSource, 'default')
  option.set()
  a.strictEqual(option.get(), true)
  a.strictEqual(option.valueSource, 'argv')
  option.set()
  a.strictEqual(option.get(), true)
  a.strictEqual(option.valueSource, 'argv')
})
