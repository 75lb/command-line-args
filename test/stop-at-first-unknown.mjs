import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('stop-at-first-unknown')

tom.test('simple', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean },
    { name: 'two', type: Boolean }
  ]
  const argv = [ '--one', 'a', '--two' ]
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true, partial: true })
  a.deepStrictEqual(result, {
    one: true,
    _unknown: [ 'a', '--two' ]
  })
})

tom.test('with a singlular defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ]
  const argv = [ '--one', '1', '--', '--two', '2' ]
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true })
  a.deepStrictEqual(result, {
    one: '1',
    _unknown: [ '--', '--two', '2' ]
  })
})

tom.test('with a singlular defaultOption and partial', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ]
  const argv = [ '--one', '1', '--', '--two', '2' ]
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true, partial: true })
  a.deepStrictEqual(result, {
    one: '1',
    _unknown: [ '--', '--two', '2' ]
  })
})

export default tom
