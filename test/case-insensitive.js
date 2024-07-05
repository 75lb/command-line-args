import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('disabled', function () {
  const optionDefinitions = [
    { name: 'dryRun', type: Boolean, alias: 'd' }]

  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['--DRYrun'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '--DRYrun'
  )
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['-D'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '-D'
  )
})

tom.test('option no value', function () {
  const optionDefinitions = [
    { name: 'dryRun', type: Boolean }]
  const argv = ['--DRYrun']
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true })
  a.deepStrictEqual(result, {
    dryRun: true
  })
})

tom.test('option with value', function () {
  const optionDefinitions = [
    { name: 'colour', type: String }
  ]
  const argv = ['--coLour', 'red']
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true })
  a.deepStrictEqual(result, {
    colour: 'red'
  })
})

tom.test('alias', function () {
  const optionDefinitions = [
    { name: 'dryRun', type: Boolean, alias: 'd' }]
  const argv = ['-D']
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true })
  a.deepStrictEqual(result, {
    dryRun: true
  })
})

tom.test('multiple', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, multiple: true }
  ]
  const argv = ['--colour=red', '--COLOUR', 'green', '--colOUR', 'blue']
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true })
  a.deepStrictEqual(result, {
    colour: ['red', 'green', 'blue']
  })
})

tom.test('camelCase', function () {
  const optionDefinitions = [
    { name: 'dry-run', type: Boolean }
  ]
  const argv = ['--dry-RUN']
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true, caseInsensitive: true })
  a.deepStrictEqual(result, {
    dryRun: true
  })
})

export default tom
