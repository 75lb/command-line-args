import commandLineArgs from '../index.mjs'
import a from 'assert'


test('bad-input: missing option value should be null', function () {
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

test('bad-input: handles arrays with relative paths', function () {
  const optionDefinitions = [
    { name: 'colours', type: String, multiple: true }
  ]
  const argv = ['--colours', '../what', '../ever']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colours: ['../what', '../ever']
  })
})

test('bad-input: empty string added to unknown values', function () {
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

test('bad-input: non-strings in argv', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  const argv = ['--one', 1]
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, { one: 1 })
})
