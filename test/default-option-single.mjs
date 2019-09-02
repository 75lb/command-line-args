import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('default-option-single')

tom.test('after a boolean', function () {
  const definitions = [
    { name: 'one', type: Boolean },
    { name: 'two', defaultOption: true }
  ]
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: [ '--one', 'sfsgf' ] }),
    { one: true, two: 'sfsgf' }
  )
})

tom.test('value equal to defaultValue', function () {
  const definitions = [
    { name: 'file', defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = [ 'file1' ]
  const options = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(options, {
    file: 'file1'
  })
})

tom.test('string value can be set by argv only once', function () {
  const definitions = [
    { name: 'file', defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = [ '--file', '--file=file2' ]
  const options = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(options, {
    file: 'file2'
  })
})

tom.test('string value cannot be set by argv twice', function () {
  const definitions = [
    { name: 'file', defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = [ '--file', '--file=file2', 'file3' ]
  a.throws(
    () => commandLineArgs(definitions, { argv }),
    /UNKNOWN_VALUE/
  )
})

export default tom
