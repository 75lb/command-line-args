import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('long option', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = ['--one', '--one']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'ALREADY_SET' && err.optionName === 'one'
  )
})

tom.test('short option', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, alias: 'o' }
  ]
  const argv = ['--one', '-o']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'ALREADY_SET' && err.optionName === 'one'
  )
})

tom.test('--option=value', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = ['--one=1', '--one=1']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'ALREADY_SET' && err.optionName === 'one'
  )
})

tom.test('combined short option', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, alias: 'o' }
  ]
  const argv = ['-oo']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'ALREADY_SET' && err.optionName === 'one'
  )
})

export default tom
