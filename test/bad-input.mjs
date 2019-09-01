import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('bad-input: an unset option should not be defined', function () {
  const optionDefinitions = [
    { name: 'colour' }
  ]
  const argv = []
  const result = commandLineArgs(optionDefinitions, { argv })
  a.strictEqual(result.colour, undefined)
})

runner.test('bad-input: missing option value should be null', function () {
  const optionDefinitions = [
    { name: 'colour' },
    { name: 'files' }
  ]
  const argv = [ '--colour' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colour: null
  })
})

runner.test('bad-input: missing option value should be null 2', function () {
  const optionDefinitions = [
    { name: 'colour' },
    { name: 'files' }
  ]
  const argv = [ '--colour', '--files', 'yeah' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colour: null,
    files: 'yeah'
  })
})

runner.test('bad-input: handles arrays with relative paths', function () {
  const optionDefinitions = [
    { name: 'colours', multiple: true }
  ]
  const argv = [ '--colours', '../what', '../ever' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colours: [ '../what', '../ever' ]
  })
})

runner.test('bad-input: non-strings in argv', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  const argv = [ '--one', 1 ]
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, { one: 1 })
})
