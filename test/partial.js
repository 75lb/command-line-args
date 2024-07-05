import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('simple', function () {
  const definitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = ['--two', 'two', '--one', 'two']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    one: true,
    _unknown: ['--two', 'two', 'two']
  })
})

tom.test('defaultOption', function () {
  const definitions = [
    { name: 'files', type: String, defaultOption: true, multiple: true }
  ]
  const argv = ['--files', 'file1', '--one', 'file2']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: ['file1', 'file2'],
    _unknown: ['--one']
  })
})

tom.test('defaultOption: floating args present but no defaultOption', function () {
  const definitions = [
    { name: 'one', type: Boolean }
  ]
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['aaa', '--one', 'aaa', 'aaa'], partial: true }),
    {
      one: true,
      _unknown: ['aaa', 'aaa', 'aaa']
    }
  )
})

tom.test('combined short option, both unknown', function () {
  const definitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' }
  ]
  const argv = ['-ab']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    _unknown: ['-a', '-b']
  })
})

tom.test('combined short option, one known, one unknown', function () {
  const definitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' }
  ]
  const argv = ['-ob']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    one: null,
    _unknown: ['-b']
  })
})

tom.test('defaultOption with --option=value and combined short options', function () {
  const definitions = [
    { name: 'files', type: String, defaultOption: true, multiple: true },
    { name: 'one', type: Boolean },
    { name: 'two', alias: 't', defaultValue: 2 }
  ]
  const argv = ['file1', '--one', 'file2', '-t', '--two=3', 'file3', '-ab']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: ['file1', 'file2', 'file3'],
    two: '3',
    one: true,
    _unknown: ['-a', '-b']
  })
})

tom.test('defaultOption with value equal to defaultValue', function () {
  const definitions = [
    { name: 'file', type: String, defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = ['file1', '--two=3', '--four', '5']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    file: 'file1',
    _unknown: ['--two=3', '--four', '5']
  })
})

tom.test('string defaultOption can be set by argv once', function () {
  const definitions = [
    { name: 'file', type: String, defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = ['--file', '--file=file2', '--two=3', '--four', '5']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    file: 'file2',
    _unknown: ['--two=3', '--four', '5']
  })
})

tom.test('string defaultOption can not be set by argv twice', function () {
  const definitions = [
    { name: 'file', type: String, defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = ['--file', '--file=file2', '--two=3', '--four', '5', 'file3']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    file: 'file2',
    _unknown: ['--two=3', '--four', '5', 'file3']
  })
})

tom.test('defaultOption with value equal to defaultValue 3', function () {
  const definitions = [
    { name: 'file', type: String, defaultOption: true, defaultValue: 'file1' }
  ]
  const argv = ['file1', 'file2', '--two=3', '--four', '5']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    file: 'file1',
    _unknown: ['file2', '--two=3', '--four', '5']
  })
})

tom.test('multiple', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true }
  ]
  const argv = ['file1', '--files', 'file2', '-t', '--two=3', 'file3', '-ab', '--files=file4']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: ['file2', 'file4'],
    _unknown: ['file1', '-t', '--two=3', 'file3', '-a', '-b']
  })
})

tom.test('unknown options: rejected defaultOption values end up in _unknown', function () {
  const definitions = [
    { name: 'foo', type: String },
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'libs', type: String, defaultOption: true }
  ]
  const argv = ['--foo', 'bar', '-v', 'libfn', '--libarg', 'val1', '-r']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    foo: 'bar',
    verbose: true,
    libs: 'libfn',
    _unknown: ['--libarg', 'val1', '-r']
  })
})

tom.test('defaultOption with --option=value notation', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true, defaultOption: true }
  ]
  const argv = ['file1', 'file2', '--unknown=something']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: ['file1', 'file2'],
    _unknown: ['--unknown=something']
  })
})

tom.test('defaultOption with --option=value notation 2', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true, defaultOption: true }
  ]
  const argv = ['file1', 'file2', '--unknown=something', '--files', 'file3', '--files=file4']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: ['file1', 'file2', 'file3', 'file4'],
    _unknown: ['--unknown=something']
  })
})

tom.test('defaultOption with --option=value notation 3', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true, defaultOption: true }
  ]
  const argv = ['--unknown', 'file1', '--another', 'something', 'file2', '--unknown=something', '--files', 'file3', '--files=file4']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    files: ['file1', 'something', 'file2', 'file3', 'file4'],
    _unknown: ['--unknown', '--another', '--unknown=something']
  })
})

tom.test('mulitple unknowns with same name', function () {
  const definitions = [
    { name: 'file' }
  ]
  const argv = ['--unknown', '--unknown=something', '--file=file1', '--unknown']
  const options = commandLineArgs(definitions, { argv, partial: true })
  a.deepStrictEqual(options, {
    file: 'file1',
    _unknown: ['--unknown', '--unknown=something', '--unknown']
  })
})

tom.test('defaultOption: single string', function () {
  const optionDefinitions = [
    { name: 'files', defaultOption: true }
  ]
  const argv = ['file1', 'file2']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv, partial: true }), {
    files: 'file1',
    _unknown: ['file2']
  })
})

export default tom
