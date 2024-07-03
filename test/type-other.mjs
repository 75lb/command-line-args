import commandLineArgs from '../index.mjs'
import a from 'assert'


test('type-other: different values', function () {
  const definitions = [
    {
      name: 'file',
      type: function (file) {
        return file
      }
    }
  ]

  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file', 'one.js'] }),
    { file: 'one.js' }
  )
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file'] }),
    { file: null }
  )
})

test('type-other: broken custom type function', function () {
  const definitions = [
    {
      name: 'file',
      type: function (file) {
        throw new Error('broken')
      }
    }
  ]
  a.throws(function () {
    commandLineArgs(definitions, { argv: ['--file', 'one.js'] })
  })
})

test('type-other-multiple: different values', function () {
  const definitions = [
    {
      name: 'file',
      multiple: true,
      type: function (file) {
        return file
      }
    }
  ]

  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file', 'one.js'] }),
    { file: ['one.js'] }
  )
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file', 'one.js', 'two.js'] }),
    { file: ['one.js', 'two.js'] }
  )
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file'] }),
    { file: [] }
  )
})
