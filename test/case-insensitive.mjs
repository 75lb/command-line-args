import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('case-insensitive: option no value', function () {
  const optionDefinitions = [
    { name: 'caseInsensitiveOption', type: Boolean, caseSensitive: false },
    { name: 'caseSensitiveOption', type: String }
  ]
  const argv = ['--CASEinsensitiveOPTION', '--caseSensitiveOption', 'val1'];
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    caseInsensitiveOption: true,
    caseSensitiveOption: 'val1'
  })
})

runner.test('case-insensitive: option with value', function () {
    const optionDefinitions = [
      { name: 'caseInsensitiveOption1', type: String, caseSensitive: false },
      { name: 'caseInsensitiveOption2', type: String, caseSensitive: false },
      { name: 'caseSensitiveArg', type: String }
    ]
    const argv = ['--caseINsensITiveOption1', 'val1', '--caseinsensitiveoption2=val2', '--caseSensitiveArg', 'val3'];
    const result = commandLineArgs(optionDefinitions, { argv })
    a.deepStrictEqual(result, {
      caseInsensitiveOption1: 'val1',
      caseInsensitiveOption2: 'val2',
      caseSensitiveArg: 'val3'
    })
  })

  runner.test('case-insensitive: does not apply to alias', function () {
    const optionDefinitions = [
      { name: 'caseInsensitiveSwitch', type: Boolean, caseSensitive: false, alias: 'c' }
    ]
    const result = commandLineArgs(optionDefinitions, { argv: ['-c'] })
    a.deepStrictEqual(result, {
      caseInsensitiveSwitch: true
    })

    a.throws(
      () => commandLineArgs(optionDefinitions, { argv: ['C'] }),
      err => err.name === 'UNKNOWN_VALUE' && err.value === 'C'
    )
  })

  runner.test('case-insensitive: multiple', function () {
    const optionDefinitions = [
      { name: 'caseInsensitiveOption', type: String, caseSensitive: false, multiple: true }
    ]
    const argv = ['--caseInsensitiveOption=a', '--caseinsensitiveoption', 'b', '--CASEINSENSITIVEOPTION', 'c'];
    const result = commandLineArgs(optionDefinitions, { argv })
    a.deepStrictEqual(result, {
      caseInsensitiveOption: ['a', 'b', 'c']
    })
  })

  runner.test('case-insensitive: camelCase', function () {
    const optionDefinitions = [
      { name: 'case-insensitive-option', type: Boolean, caseSensitive: false },
      { name: 'case-sensitive-option', type: String },
    ]
    const argv = ['--case-INSENSITIVE-option', '--case-sensitive-option', 'val1'];
    const result = commandLineArgs(optionDefinitions, { argv, camelCase: true })
    a.deepStrictEqual(result, {
      caseInsensitiveOption: true,
      caseSensitiveOption: 'val1'
    })
  })
