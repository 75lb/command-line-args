import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('empty argv', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ]
  const argv = []
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {})
})

tom.test('boolean, empty argv', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, multiple: true }
  ]
  const argv = []
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, { })
})

tom.test('string unset with defaultValue', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true, defaultValue: 1 }
  ]
  const argv = []
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, { one: [1] })
})

tom.test('string', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ]
  const argv = ['--one', '1', '2']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['1', '2']
  })
})

tom.test('string, --option=value', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ]
  const argv = ['--one=1', '--one=2']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['1', '2']
  })
})

tom.test('string, --option=value mix', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ]
  const argv = ['--one=1', '--one=2', '3']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['1', '2', '3']
  })
})

tom.test('string, defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true, defaultOption: true }
  ]
  const argv = ['1', '2']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, {
    one: ['1', '2']
  })
})

export default tom
