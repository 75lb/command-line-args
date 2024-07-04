import TestRunner from 'test-runner'
import commandLineArgs from '../index.js'
import a from 'assert'

const tom = new TestRunner.Tom('default-value')

tom.test('default value', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two', defaultValue: 'two' }
  ]
  const argv = ['--one', '1']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: '1',
    two: 'two'
  })
})

tom.test('default value 2', function () {
  const optionDefinitions = [
    { name: 'two', defaultValue: 'two' }
  ]
  const argv = []
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), { two: 'two' })
})

tom.test('default value 3', function () {
  const optionDefinitions = [
    { name: 'two', defaultValue: 'two' }
  ]
  const argv = ['--two', 'zwei']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), { two: 'zwei' })
})

tom.test('default value 4', function () {
  const optionDefinitions = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }
  ]
  const argv = ['--two', 'duo']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), { two: ['duo'] })
})

tom.test('default value 5', function () {
  const optionDefinitions = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }
  ]
  const argv = []
  const result = commandLineArgs(optionDefinitions, { argv })
  a.deepStrictEqual(result, { two: ['two', 'zwei'] })
})

tom.test('array as defaultOption', function () {
  const optionDefinitions = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'], defaultOption: true }
  ]
  const argv = ['duo']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), { two: ['duo'] })
})

tom.test('falsy default values', function () {
  const optionDefinitions = [
    { name: 'one', defaultValue: 0 },
    { name: 'two', defaultValue: false }
  ]

  const argv = []
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: 0,
    two: false
  })
})

tom.test('is arrayifed if multiple set', function () {
  const optionDefinitions = [
    { name: 'one', defaultValue: 0, multiple: true }
  ]

  let argv = []
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: [0]
  })
  argv = ['--one', '2']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: ['2']
  })
})

tom.test('combined with defaultOption', function () {
  const optionDefinitions = [
    { name: 'path', defaultOption: true, defaultValue: './' }
  ]

  let argv = ['--path', 'test']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: 'test'
  })
  argv = ['test']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: 'test'
  })
  argv = []
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: './'
  })
})

tom.test('combined with multiple and defaultOption', function () {
  const optionDefinitions = [
    { name: 'path', multiple: true, defaultOption: true, defaultValue: './' }
  ]

  let argv = ['--path', 'test1', 'test2']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['test1', 'test2']
  })
  argv = ['--path', 'test']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['test']
  })
  argv = ['test1', 'test2']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['test1', 'test2']
  })
  argv = ['test']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['test']
  })
  argv = []
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['./']
  })
})

tom.test('array default combined with multiple and defaultOption', function () {
  const optionDefinitions = [
    { name: 'path', multiple: true, defaultOption: true, defaultValue: ['./'] }
  ]

  let argv = ['--path', 'test1', 'test2']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['test1', 'test2']
  })
  argv = ['--path', 'test']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['test']
  })
  argv = ['test1', 'test2']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['test1', 'test2']
  })
  argv = ['test']
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['test']
  })
  argv = []
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    path: ['./']
  })
})

export default tom
