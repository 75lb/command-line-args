'use strict'
const TestRunner = require('test-runner')
const Option = require('../../lib/option')
const a = require('assert')

const runner = new TestRunner()

runner.test('option.set(): simple set string', function () {
  const option = Option.create({ name: 'two' })
  a.strictEqual(option.get(), null)
  a.strictEqual(option.state, 'default')
  option.set('zwei')
  a.strictEqual(option.get(), 'zwei')
  a.strictEqual(option.state, 'set')
  option.set('drei')
  a.strictEqual(option.get(), 'drei')
  a.strictEqual(option.state, 'set')
})

runner.test('option.set(): simple set boolean', function () {
  const option = Option.create({ name: 'two', type: Boolean })
  a.strictEqual(option.get(), null)
  a.strictEqual(option.state, 'default')
  option.set()
  a.strictEqual(option.get(), true)
  a.strictEqual(option.state, 'set')
  option.set()
  a.strictEqual(option.get(), true)
  a.strictEqual(option.state, 'set')
})

runner.test('option.set(): string multiple', function () {
  const option = Option.create({ name: 'two', multiple: true })
  a.deepStrictEqual(option.get(), [])
  a.strictEqual(option.state, 'default')
  option.set('1')
  a.deepStrictEqual(option.get(), [ '1' ])
  a.strictEqual(option.state, 'set')
  option.set('2')
  a.deepStrictEqual(option.get(), [ '1', '2' ])
  a.strictEqual(option.state, 'set')
})

runner.test('option.set: lazyMultiple', function () {
  const option = Option.create({ name: 'one', lazyMultiple: true })
  a.deepStrictEqual(option.get(), [])
  a.strictEqual(option.state, 'default')
  option.set('1')
  a.deepStrictEqual(option.get(), [ '1' ])
  a.strictEqual(option.state, 'set')
  option.set('2')
  a.deepStrictEqual(option.get(), [ '1', '2' ])
  a.strictEqual(option.state, 'set')
})
