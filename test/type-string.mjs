import commandLineArgs from '../index.mjs'
import a from 'assert'


test('type-string: different values', function () {
  const optionDefinitions = [
    { name: 'one', type: String }
  ]
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', 'yeah'] }),
    { one: 'yeah' }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one'] }),
    { one: null }
  )
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', '3'] }),
    { one: '3' }
  )
})
