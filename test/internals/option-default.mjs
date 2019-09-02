import TestRunner from 'test-runner'
import a from 'assert'
import Option from '../../lib/option.mjs'

const tom = new TestRunner.Tom('option-default')

tom.test('defaultValue', function () {
  const option = new Option({ name: 'two', defaultValue: 'two' })
  a.strictEqual(option.get(), 'two')
  option.set('zwei')
  a.strictEqual(option.get(), 'zwei')
})

tom.test('multiple defaultValue', function () {
  const option = new Option({ name: 'two', multiple: true, defaultValue: [ 'two', 'zwei' ] })
  a.deepStrictEqual(option.get(), [ 'two', 'zwei' ])
  option.set('duo')
  a.deepStrictEqual(option.get(), [ 'duo' ])
})

tom.test('falsy defaultValue', function () {
  const option = new Option({ name: 'one', defaultValue: 0 })
  a.strictEqual(option.get(), 0)
})

tom.test('falsy defaultValue 2', function () {
  const option = new Option({ name: 'two', defaultValue: false })
  a.strictEqual(option.get(), false)
})

tom.test('falsy defaultValue multiple', function () {
  const option = new Option({ name: 'one', defaultValue: 0, multiple: true })
  a.deepStrictEqual(option.get(), [ 0 ])
})

export default tom
