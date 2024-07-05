const TestRunner = require('test-runner')
const commandLineArgs = require('command-line-args')
const a = require('assert')

const tom = new TestRunner.Tom()

tom.test('CommonJS build works correctly', function () {
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

module.exports = tom
