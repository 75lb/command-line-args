import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('alias-cluster: two flags, one option', function () {
  const optionDefinitions = [
    { name: 'flagA', alias: 'a', type: Boolean },
    { name: 'flagB', alias: 'b', type: Boolean },
    { name: 'three', alias: 'c' }
  ]

  const argv = [ '-abc', 'yeah' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flagA: true,
    flagB: true,
    three: 'yeah'
  })
})

runner.test('alias-cluster: two flags, one option 2', function () {
  const optionDefinitions = [
    { name: 'flagA', alias: 'a', type: Boolean },
    { name: 'flagB', alias: 'b', type: Boolean },
    { name: 'three', alias: 'c' }
  ]

  const argv = [ '-c', 'yeah', '-ab' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flagA: true,
    flagB: true,
    three: 'yeah'
  })
})

runner.test('alias-cluster: three string options', function () {
  const optionDefinitions = [
    { name: 'flagA', alias: 'a' },
    { name: 'flagB', alias: 'b' },
    { name: 'three', alias: 'c' }
  ]

  const argv = [ '-abc', 'yeah' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flagA: null,
    flagB: null,
    three: 'yeah'
  })
})
