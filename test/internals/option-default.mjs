import a from 'assert'
import Option from '../../lib/option.mjs'


test('option.set(): defaultValue', function () {
  const option = new Option({ name: 'two', defaultValue: 'two' })
  a.strictEqual(option.get(), 'two')
  option.set('zwei')
  a.strictEqual(option.get(), 'zwei')
})

test('option.set(): multiple defaultValue', function () {
  const option = new Option({ name: 'two', multiple: true, defaultValue: ['two', 'zwei'] })
  a.deepStrictEqual(option.get(), ['two', 'zwei'])
  option.set('duo')
  a.deepStrictEqual(option.get(), ['duo'])
})

test('option.set(): falsy defaultValue', function () {
  const option = new Option({ name: 'one', defaultValue: 0 })
  a.strictEqual(option.get(), 0)
})

test('option.set(): falsy defaultValue 2', function () {
  const option = new Option({ name: 'two', defaultValue: false })
  a.strictEqual(option.get(), false)
})

test('option.set(): falsy defaultValue multiple', function () {
  const option = new Option({ name: 'one', defaultValue: 0, multiple: true })
  a.deepStrictEqual(option.get(), [0])
})
