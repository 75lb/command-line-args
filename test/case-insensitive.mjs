import commandLineArgs from '../index.mjs'
import a from 'assert'


test('case-insensitive: disabled', function () {
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

test('case-insensitive: option no value', function () {
  const optionDefinitions = [
    { name: 'dryRun', type: Boolean }]
  const argv = ['--DRYrun']
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true })
  a.deepStrictEqual(result, {
    dryRun: true
  })
})

test('case-insensitive: option with value', function () {
  const optionDefinitions = [
    { name: 'colour', type: String }
  ]
  const argv = ['--coLour', 'red']
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true })
  a.deepStrictEqual(result, {
    colour: 'red'
  })
})

test('case-insensitive: alias', function () {
  const optionDefinitions = [
    { name: 'dryRun', type: Boolean, alias: 'd' }]
  const argv = ['-D']
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true })
  a.deepStrictEqual(result, {
    dryRun: true
  })
})

test('case-insensitive: multiple', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, multiple: true }
  ]
  const argv = ['--colour=red', '--COLOUR', 'green', '--colOUR', 'blue']
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true })
  a.deepStrictEqual(result, {
    colour: ['red', 'green', 'blue']
  })
})

test('case-insensitive: camelCase', function () {
  const optionDefinitions = [
    { name: 'dry-run', type: Boolean }
  ]
  const argv = ['--dry-RUN']
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true, caseInsensitive: true })
  a.deepStrictEqual(result, {
    dryRun: true
  })
})
