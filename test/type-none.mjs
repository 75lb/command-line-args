import commandLineArgs from '../index.mjs'
import a from 'assert'


const definitions = [
  { name: 'one' },
  { name: 'two' }
]

test('name: no argv values', function () {
  const argv = []
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {})
})

test('name: just names, no values', function () {
  const argv = ['--one', '--two']
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {
    one: null,
    two: null
  })
})

test('name: just names, one value, one unpassed value', function () {
  const argv = ['--one', 'one', '--two']
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {
    one: 'one',
    two: null
  })
})

test('name: just names, two values', function () {
  const argv = ['--one', 'one', '--two', 'two']
  const result = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(result, {
    one: 'one',
    two: 'two'
  })
})
