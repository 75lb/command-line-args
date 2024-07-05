import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('missing option value should be null', function () {
  const optionDefinitions = [
    { name: 'colour', type: String },
    { name: 'files' }
  ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: ['--colour'] }), {
    colour: null
  })
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: ['--colour', '--files', 'yeah'] }), {
    colour: null,
    files: 'yeah'
  })
})

tom.test('handles arrays with relative paths', function () {
  const optionDefinitions = [
    { name: 'colours', type: String, multiple: true }
  ]
  const argv = ['--colours', '../what', '../ever']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colours: ['../what', '../ever']
  })
})

tom.test('empty string added to unknown values', function () {
  const optionDefinitions = [
    { name: 'one', type: String },
    { name: 'two', type: Number },
    { name: 'three', type: Number, multiple: true },
    { name: 'four', type: String },
    { name: 'five', type: Boolean }
  ]
  const argv = ['--one', '', '', '--two', '0', '--three=', '', '--four=', '--five=']
  a.throws(() => {
    commandLineArgs(optionDefinitions, { argv })
  })
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv, partial: true }), {
    one: '',
    two: 0,
    three: [0, 0],
    four: '',
    five: true,
    _unknown: ['', '--five=']
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
