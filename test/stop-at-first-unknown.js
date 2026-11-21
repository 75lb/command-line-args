import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('double dash with a multiple defaultOption (#119)', function () {
  const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'src', type: String, defaultOption: true, multiple: true },
    { name: 'timeout', alias: 't', type: Number }
  ]
  const argv = ['one', '-t', '0', '--', '--verbose', 'two']
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true })
  a.deepStrictEqual(result, {
    src: ['one'],
    timeout: 0,
    _unknown: ['--', '--verbose', 'two']
  })
})

tom.test('double dash before a defaultOption is set', function () {
  for (const multiple of [false, true]) {
    const result = commandLineArgs([
      { name: 'src', defaultOption: true, multiple },
      { name: 'verbose', type: Boolean }
    ], { argv: ['--', '--verbose', 'two'], stopAtFirstUnknown: true })
    a.deepStrictEqual(result, { _unknown: ['--', '--verbose', 'two'] })
  }
})

tom.test('double dash with a pending or greedy option value', function () {
  for (const multiple of [false, true]) {
    const result = commandLineArgs([
      { name: 'src', multiple },
      { name: 'verbose', type: Boolean }
    ], { argv: ['--src', '--', '--verbose'], stopAtFirstUnknown: true })
    a.deepStrictEqual(result, {
      src: multiple ? [] : null,
      _unknown: ['--', '--verbose']
    })
  }
})

tom.test('double dash preserves the following short option clusters', function () {
  const result = commandLineArgs([
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'quiet', alias: 'q', type: Boolean },
    { name: 'src', defaultOption: true, multiple: true }
  ], { argv: ['-vq', 'one', '--', '-qv', '-qv', '--src=two'], stopAtFirstUnknown: true })
  a.deepStrictEqual(result, {
    verbose: true,
    quiet: true,
    src: ['one'],
    _unknown: ['--', '-qv', '-qv', '--src=two']
  })
})

tom.test('double dash in equals notation remains an option value', function () {
  const result = commandLineArgs([
    { name: 'src' },
    { name: 'verbose', type: Boolean }
  ], { argv: ['--src=--', '--verbose'], stopAtFirstUnknown: true })
  a.deepStrictEqual(result, { src: '--', verbose: true })
})

tom.test('double dash remains a value without stopAtFirstUnknown', function () {
  for (const partial of [false, true]) {
    const result = commandLineArgs([
      { name: 'src', defaultOption: true, multiple: true },
      { name: 'verbose', type: Boolean }
    ], { argv: ['one', '--', '--verbose', 'two'], partial })
    a.deepStrictEqual(result, { src: ['one', '--', 'two'], verbose: true })
  }
})

tom.test('stopAtFirstUnknown', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean },
    { name: 'two', type: Boolean }
  ]
  const argv = ['--one', 'a', '--two']
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true, partial: true })
  a.deepStrictEqual(result, {
    one: true,
    _unknown: ['a', '--two']
  })
})

tom.test('with a singlular defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ]
  const argv = ['--one', '1', '--', '--two', '2']
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true })
  a.deepStrictEqual(result, {
    one: '1',
    _unknown: ['--', '--two', '2']
  })
})

tom.test('with a singlular defaultOption and partial', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ]
  const argv = ['--one', '1', '--', '--two', '2']
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true, partial: true })
  a.deepStrictEqual(result, {
    one: '1',
    _unknown: ['--', '--two', '2']
  })
})

export default tom
