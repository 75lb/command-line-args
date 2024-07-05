import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

const definitions = [
  { name: 'one' },
  { name: 'two' }
]

tom.test('no argv values', function () {
  const argv = []
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {})
})

tom.test('just names, no values', function () {
  const argv = ['--one', '--two']
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {
    one: null,
    two: null
  })
})

tom.test('just names, one value, one unpassed value', function () {
  const argv = ['--one', 'one', '--two']
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {
    one: 'one',
    two: null
  })
})

tom.test('just names, two values', function () {
  const argv = ['--one', 'one', '--two', 'two']
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {
    one: 'one',
    two: 'two'
  })
})

export default tom
