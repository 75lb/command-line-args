import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('should automatically remove first two argv items', function () {
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs({ name: 'one' }), {
    one: 'eins'
  })
})

tom.test('should automatically remove first two argv items 2', function () {
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs({ name: 'one' }, { argv: process.argv }), {
    one: 'eins'
  })
})

tom.test('process.argv is left untouched', function () {
  process.argv = ['node', 'filename', '--one', 'eins']
  a.deepStrictEqual(commandLineArgs({ name: 'one' }), {
    one: 'eins'
  })
  a.deepStrictEqual(process.argv, ['node', 'filename', '--one', 'eins'])
})

export default tom
