import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('alias')

tom.test('one string alias', function () {
  const optionDefinitions = [
    { name: 'verbose', alias: 'v' }
  ]
  const argv = ['-v']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    verbose: null
  })
})

tom.test('one boolean alias', function () {
  const optionDefinitions = [
    { name: 'dry-run', alias: 'd', type: Boolean }
  ]
  const argv = ['-d']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    'dry-run': true
  })
})

tom.test('one boolean, one string', function () {
  const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'colour', alias: 'c' }
  ]
  const argv = ['-v', '-c']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    verbose: true,
    colour: null
  })
})

export default tom
