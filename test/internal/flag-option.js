'use strict'
const TestRunner = require('test-runner')
const FlagOption = require('../../lib/flag-option')
const a = require('assert')

const runner = new TestRunner()

runner.test('type-boolean: different values', function () {
  const option = new FlagOption({ name: 'one', type: Boolean })

  option.set(undefined)
  a.strictEqual(option.get(), true)
  option.set('true')
  a.strictEqual(option.get(), true)
  option.set('false')
  a.strictEqual(option.get(), true)
  option.set('sdsdf')
  a.strictEqual(option.get(), true)
})

const origBoolean = Boolean

/* test in contexts which override the standard global Boolean constructor */
runner.test('type-boolean: global Boolean overridden', function () {
  function Boolean () {
    return origBoolean.apply(origBoolean, arguments)
  }

  const option = new FlagOption({ name: 'one', type: Boolean })

  option.set(undefined)
  a.strictEqual(option.get(), true)
  option.set('true')
  a.strictEqual(option.get(), true)
  option.set('false')
  a.strictEqual(option.get(), true)
  option.set('sdsdf')
  a.strictEqual(option.get(), true)
})

runner.test('type-boolean-multiple: 1', function () {
  const option = new FlagOption({ name: 'one', type: Boolean, multiple: true })

  option.set(undefined)
  option.set(undefined)
  option.set(undefined)

  a.deepStrictEqual(option.get(), [ true, true, true ])
})
