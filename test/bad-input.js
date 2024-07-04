import TestRunner from 'test-runner'
import commandLineArgs from '../index.js'
import a from 'assert'

const tom = new TestRunner.Tom('bad-input')

tom.test('an unset option should not be defined', function () {
  const optionDefinitions = [
    { name: 'colour' }
  ]
  const argv = []
  const result = commandLineArgs(optionDefinitions, { argv })
  a.strictEqual(result.colour, undefined)
})

tom.test('missing option value should be null', function () {
  const optionDefinitions = [
    { name: 'colour' },
    { name: 'files' }
  ]
  const argv = ['--colour']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colour: null
  })
})

tom.test('missing option value should be null 2', function () {
  const optionDefinitions = [
    { name: 'colour' },
    { name: 'files' }
  ]
  const argv = ['--colour', '--files', 'yeah']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colour: null,
    files: 'yeah'
  })
})

tom.test('handles arrays with relative paths', function () {
  const optionDefinitions = [
    { name: 'colours', multiple: true }
  ]
  const argv = ['--colours', '../what', '../ever']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colours: ['../what', '../ever']
  })
})

tom.test('non-strings in argv', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  const argv = ['--one', 1]
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, { one: 1 })
})

export default tom
