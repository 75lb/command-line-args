import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('alias-whitespace: with space after option', function () {
  const optionDefinitions = [
    { name: 'file', alias: 'f' }
  ]
  const argv = [ '-f', 'one' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    file: 'one'
  })
})

runner.test('alias-whitespace: without space after option', function () {
  const optionDefinitions = [
    { name: 'file', alias: 'f' }
  ]
  const argv = [ '-fone' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    file: 'one'
  })
})

runner.test('alias-whitespace: with space after option in cluster', function () {
  const optionDefinitions = [
    { name: 'file', alias: 'f' },
    { name: 'verbose', alias: 'v', type: Boolean }
  ]
  const argv = [ '-vf', 'one' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    verbose: true,
    file: 'one'
  })
})

runner.test('alias-whitespace: without space after option in cluster', function () {
  const optionDefinitions = [
    { name: 'file', alias: 'f' },
    { name: 'verbose', alias: 'v', type: Boolean }
  ]
  const argv = [ '-vfone' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    verbose: true,
    file: 'one'
  })
})
