import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('type-string')

tom.test('different values', function () {
  const optionDefinitions = [
    { name: 'one', type: String }
  ]
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: [ '--one', 'yeah' ] }),
    { one: 'yeah' }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: [ '--one' ] }),
    { one: null }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: [ '--one', '3' ] }),
    { one: '3' }
  )
})

export default tom
