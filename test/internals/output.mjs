import TestRunner from 'test-runner'
import a from 'assert'
import Output from '../../lib/output.mjs'
import Option from '../../lib/option.mjs'

const runner = new TestRunner()

runner.test('output.toObject(): no defs set', function () {
  const output = new Output([
    { name: 'one' }
  ])
  a.deepStrictEqual(output.toObject(), {})
})

runner.test('output.toObject(): one def set', function () {
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
