import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const tom = new TestRunner.Tom('default-option')

tom.test('multiple string', function () {
  const optionDefinitions = [
    { name: 'files', defaultOption: true, multiple: true }
  ]
  const argv = ['file1', 'file2']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    files: ['file1', 'file2']
  })
})

tom.test('multiple-defaultOption values spread out', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'files', defaultOption: true, multiple: true }
  ]
  const argv = ['--one', '1', 'file1', 'file2', '--two', '2']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: '1',
    two: '2',
    files: ['file1', 'file2']
  })
})

tom.test('multiple-defaultOption values spread out 2', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean },
    { name: 'two' },
    { name: 'files', defaultOption: true, multiple: true }
  ]
  const argv = ['file0', '--one', 'file1', '--files', 'file2', '--two', '2', 'file3']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: true,
    two: '2',
    files: ['file0', 'file1', 'file2', 'file3']
  })
})

tom.test('multiple with --option=value', function () {
  const definitions = [
    { name: 'files', defaultOption: true, multiple: true },
    { name: 'one', type: Boolean },
    { name: 'two', alias: 't', defaultValue: 2 }
  ]
  const argv = ['file1', '--one', 'file2', '-t', '--two=3', 'file3']
  const options = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(options, {
    files: ['file1', 'file2', 'file3'],
    two: '3',
    one: true
  })
})

export default tom
