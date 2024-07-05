import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('different values', function () {
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

tom.test('broken custom type function', function () {
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

tom.test('multiple: different values', function () {
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

export default tom
