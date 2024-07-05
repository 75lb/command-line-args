import TestRunner from 'test-runner'
import a from 'assert'
import FlagOption from '../../lib/option-flag.js'

const tom = new TestRunner.Tom()

tom.test('single set', function () {
  const option = new FlagOption({ name: 'one', type: Boolean })

  option.set(undefined)
  a.strictEqual(option.get(), true)
})

tom.test('single set 2', function () {
  const option = new FlagOption({ name: 'one', type: Boolean })

  option.set('true')
  a.strictEqual(option.get(), true)
})

tom.test('set twice', function () {
  const option = new FlagOption({ name: 'one', type: Boolean })

  option.set(undefined)
  a.strictEqual(option.get(), true)
  a.throws(
    () => option.set('true'),
    err => err.name === 'ALREADY_SET'
  )
})

const origBoolean = Boolean

/* test in contexts which override the standard global Boolean constructor */
tom.test('global Boolean overridden', function () {
  function Boolean () {
    return origBoolean.apply(origBoolean, arguments)
  }

  const option = new FlagOption({ name: 'one', type: Boolean })

  option.set()
  a.strictEqual(option.get(), true)
})

tom.test('type-boolean-multiple: 1', function () {
  const option = new FlagOption({ name: 'one', type: Boolean, multiple: true })

  option.set(undefined)
  option.set(undefined)
  option.set(undefined)

  a.deepStrictEqual(option.get(), [true, true, true])
})

export default tom
