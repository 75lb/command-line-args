import a from 'assert'
import Option from '../../lib/option.mjs'


test('option.set(): simple set string', function () {
  const option = Option.create({ name: 'two' })
  a.strictEqual(option.get(), null)
  a.strictEqual(option.state, 'default')
  option.set('zwei')
  a.strictEqual(option.get(), 'zwei')
  a.strictEqual(option.state, 'set')
})

test('option.set(): simple set boolean', function () {
  const option = Option.create({ name: 'two', type: Boolean })
  a.strictEqual(option.get(), null)
  a.strictEqual(option.state, 'default')
  option.set()
  a.strictEqual(option.get(), true)
  a.strictEqual(option.state, 'set')
})

test('option.set(): simple set string twice', function () {
  const option = Option.create({ name: 'two' })
  a.strictEqual(option.get(), null)
  a.strictEqual(option.state, 'default')
  option.set('zwei')
  a.strictEqual(option.get(), 'zwei')
  a.strictEqual(option.state, 'set')
  a.throws(
    () => option.set('drei'),
    err => err.name === 'ALREADY_SET'
  )
})

test('option.set(): simple set boolean twice', function () {
  const option = Option.create({ name: 'two', type: Boolean })
  a.strictEqual(option.get(), null)
  a.strictEqual(option.state, 'default')
  option.set()
  a.strictEqual(option.get(), true)
  a.strictEqual(option.state, 'set')
  a.throws(
    () => option.set(),
    err => err.name === 'ALREADY_SET'
  )
})

test('option.set(): string multiple', function () {
  const option = Option.create({ name: 'two', multiple: true })
  a.deepStrictEqual(option.get(), [])
  a.strictEqual(option.state, 'default')
  option.set('1')
  a.deepStrictEqual(option.get(), ['1'])
  a.strictEqual(option.state, 'set')
  option.set('2')
  a.deepStrictEqual(option.get(), ['1', '2'])
  a.strictEqual(option.state, 'set')
})

test('option.set: lazyMultiple', function () {
  const option = Option.create({ name: 'one', lazyMultiple: true })
  a.deepStrictEqual(option.get(), [])
  a.strictEqual(option.state, 'default')
  option.set('1')
  a.deepStrictEqual(option.get(), ['1'])
  a.strictEqual(option.state, 'set')
  option.set('2')
  a.deepStrictEqual(option.get(), ['1', '2'])
  a.strictEqual(option.state, 'set')
})

test('option.set(): string multiple defaultOption', function () {
  const option = Option.create({ name: 'two', multiple: true, defaultOption: true })
  a.deepStrictEqual(option.get(), [])
  a.strictEqual(option.state, 'default')
  option.set('1')
  a.deepStrictEqual(option.get(), ['1'])
  a.strictEqual(option.state, 'set')
  option.set('2')
  a.deepStrictEqual(option.get(), ['1', '2'])
  a.strictEqual(option.state, 'set')
})

test('option.set: lazyMultiple defaultOption', function () {
  const option = Option.create({ name: 'one', lazyMultiple: true, defaultOption: true })
  a.deepStrictEqual(option.get(), [])
  a.strictEqual(option.state, 'default')
  option.set('1')
  a.deepStrictEqual(option.get(), ['1'])
  a.strictEqual(option.state, 'set')
  option.set('2')
  a.deepStrictEqual(option.get(), ['1', '2'])
  a.strictEqual(option.state, 'set')
})
