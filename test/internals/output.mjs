import a from 'assert'
import Output from '../../lib/output.mjs'
import Option from '../../lib/option.mjs'


test('output.toObject(): no defs set', function () {
  const output = new Output([
    { name: 'one' }
  ])
  a.deepStrictEqual(output.toObject(), { _inputs: {} })
})

test('output.toObject(): one def set', function () {
  const output = new Output([
    { name: 'one' }
  ])
  const option = Option.create({ name: 'one' })
  option.set('yeah')
  output.set('one', option)
  a.deepStrictEqual(output.toObject(), {
    _inputs: { one: 'yeah' },
    one: 'yeah'
  })
})
