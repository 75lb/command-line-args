import commandLineArgs from '../index.mjs'
import a from 'assert'


test('detect process.argv: should automatically remove first two argv items', function () {
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs({ name: 'one' }), {
    one: 'eins'
  })
})

test('detect process.argv: should automatically remove first two argv items 2', function () {
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs({ name: 'one' }, { argv: process.argv }), {
    one: 'eins'
  })
})

test('process.argv is left untouched', function () {
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs({ name: 'one' }), {
    one: 'eins'
  })
  a.deepStrictEqual(process.argv, ['node', 'filename', '--one', 'eins'])
})
