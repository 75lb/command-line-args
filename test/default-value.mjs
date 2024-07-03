import commandLineArgs from '../index.mjs'
import a from 'assert'


test('default value', function () {
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

test('default value 2', function () {
  const defs = [{ name: 'two', defaultValue: 'two' }]
  const argv = []
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: 'two' })
})

test('default value 3', function () {
  const defs = [{ name: 'two', defaultValue: 'two' }]
  const argv = ['--two', 'zwei']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: 'zwei' })
})

test('default value 4', function () {
  const defs = [{ name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }]
  const argv = ['--two', 'duo']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: ['duo'] })
})

test('default value 5', function () {
  const defs = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }
  ]
  const argv = []
  const result = commandLineArgs(defs, { argv })
  a.deepStrictEqual(result, { two: ['two', 'zwei'] })
})

test('default value: array as defaultOption', function () {
  const defs = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'], defaultOption: true }
  ]
  const argv = ['duo']
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: ['duo'] })
})

test('default value: falsy default values', function () {
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

test('default value: is arrayifed if multiple set', function () {
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

test('default value: combined with defaultOption', function () {
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

test('default value: combined with multiple and defaultOption', function () {
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

test('default value: array default combined with multiple and defaultOption', function () {
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
