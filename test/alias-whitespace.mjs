import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('alias-whitespace')

tom.test('with space after option', function () {
  const optionDefinitions = [
    { name: 'file', alias: 'f' }
  ]
  const argv = ['-f', 'one']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    file: 'one'
  })
})

tom.test('without space after option', function () {
  const optionDefinitions = [
    { name: 'file', alias: 'f' }
  ]
  const argv = ['-fone']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    file: 'one'
  })
})

tom.test('with space after option in cluster', function () {
  const optionDefinitions = [
    { name: 'file', alias: 'f' },
    { name: 'verbose', alias: 'v', type: Boolean }
  ]
  const argv = ['-vf', 'one']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    verbose: true,
    file: 'one'
  })
})

tom.test('without space after option in cluster', function () {
  const optionDefinitions = [
    { name: 'file', alias: 'f' },
    { name: 'verbose', alias: 'v', type: Boolean }
  ]
  const argv = ['-vfone']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    verbose: true,
    file: 'one'
  })
})

export default tom
