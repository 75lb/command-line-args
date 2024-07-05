import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('default value', function () {
  const defs = [
    { name: 'one' },
    { name: 'two', defaultValue: 'two' }
  ]
  const argv = ['--one', '1']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    one: '1',
    two: 'two'
  })
})

tom.test('default value 2', function () {
  const defs = [{ name: 'two', defaultValue: 'two' }]
  const argv = []
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: 'two' })
})

tom.test('default value 3', function () {
  const defs = [{ name: 'two', defaultValue: 'two' }]
  const argv = ['--two', 'zwei']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: 'zwei' })
})

tom.test('default value 4', function () {
  const defs = [{ name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }]
  const argv = ['--two', 'duo']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: ['duo'] })
})

tom.test('default value 5', function () {
  const defs = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }
  ]
  const argv = []
  const result = commandLineArgs(defs, { argv })
  a.deepStrictEqual(result, { two: ['two', 'zwei'] })
})

tom.test('default value: array as defaultOption', function () {
  const defs = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'], defaultOption: true }
  ]
  const argv = ['duo']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: ['duo'] })
})

tom.test('default value: falsy default values', function () {
  const defs = [
    { name: 'one', defaultValue: 0 },
    { name: 'two', defaultValue: false }
  ]

  const argv = []
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    one: 0,
    two: false
  })
})

tom.test('default value: is arrayifed if multiple set', function () {
  const defs = [
    { name: 'one', defaultValue: 0, multiple: true }
  ]

  let argv = []
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    one: [0]
  })
  argv = ['--one', '2']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    one: ['2']
  })
})

tom.test('default value: combined with defaultOption', function () {
  const defs = [
    { name: 'path', defaultOption: true, defaultValue: './' }
  ]

  let argv = ['--path', 'test']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: 'test'
  })
  argv = ['test']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: 'test'
  })
  argv = []
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: './'
  })
})

tom.test('default value: combined with multiple and defaultOption', function () {
  const defs = [
    { name: 'path', multiple: true, defaultOption: true, defaultValue: './' }
  ]

  let argv = ['--path', 'test1', 'test2']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test1', 'test2']
  })
  argv = ['--path', 'test']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test']
  })
  argv = ['test1', 'test2']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test1', 'test2']
  })
  argv = ['test']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test']
  })
  argv = []
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['./']
  })
})

tom.test('default value: array default combined with multiple and defaultOption', function () {
  const defs = [
    { name: 'path', multiple: true, defaultOption: true, defaultValue: ['./'] }
  ]

  let argv = ['--path', 'test1', 'test2']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test1', 'test2']
  })
  argv = ['--path', 'test']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test']
  })
  argv = ['test1', 'test2']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test1', 'test2']
  })
  argv = ['test']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test']
  })
  argv = []
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['./']
  })
})

export default tom
