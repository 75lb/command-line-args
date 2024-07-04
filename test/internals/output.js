import TestRunner from 'test-runner'
import a from 'assert'
import Output from '../../lib/output.js'
import Option from '../../lib/option.js'

const tom = new TestRunner.Tom('output')

tom.test('output.toObject(): no defs set', function () {
  const output = new Output([
    { name: 'one' }
  ])
  a.deepStrictEqual(output.toObject(), {})
})

tom.test('output.toObject(): one def set', function () {
  const output = new Output([
    { name: 'one' }
  ])
  const option = Option.create({ name: 'one' })
  option.set('yeah')
  output.set('one', option)
  a.deepStrictEqual(output.toObject(), {
    one: 'yeah'
  })
})

export default tom
