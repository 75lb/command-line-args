import commandLineArgs from '../index.mjs'
import a from 'assert'


test('retain-inputs: single value', function () {
  const optionDefinitions = [
    { name: 'one-two', type: Number }
  ]
  const argv = ['--one-two', '1']
  const result = commandLineArgs(optionDefinitions, { argv, retainInputs: true })
  console.log('result:', result) // DEBUG
  a.deepStrictEqual(result, {
    _inputs: { 'one-two': '1' },
    'one-two': 1
  })
})

test('retain-inputs: camelCase', function () {
  const optionDefinitions = [
    { name: 'one-two', type: Number }
  ]
  const argv = ['--one-two', '1']
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true, retainInputs: true })
  a.deepStrictEqual(result, {
    _inputs: { 'oneTwo': '1' },
    'oneTwo': 1
  })
})

test('retain-inputs: Boolean is null', function () {
  const optionDefinitions = [
    { name: 'one-two', type: Number },
    { name: 'three', type: Boolean }
  ]
  const argv = ['--one-two', '1', '--three']
  const result = commandLineArgs(optionDefinitions, { argv, retainInputs: true })
  a.deepStrictEqual(result, {
    'one-two': 1,
    three: true,
    _inputs: { 'one-two': '1', three: null }
  })
})

test('retain-inputs: multiple input', function () {
  const optionDefinitions = [
    { name: 'one-two', type: Number, multiple: true }
  ]
  const argv = ['--one-two', '1', '--one-two', '2']
  const result = commandLineArgs(optionDefinitions, { argv, retainInputs: true })
  a.deepStrictEqual(result, {
    _inputs: { 'one-two': ['1', '2'] },
    'one-two': [1, 2]
  })
})

test('retain-inputs: grouped, camelCase', function () {
  const optionDefinitions = [
    { name: 'one-one', group: 'a' },
    { name: 'two-two', group: 'a' },
    { name: 'three-three', group: 'b', type: Boolean },
    { name: 'four-four' }
  ]
  const argv = ['--one-one', '1', '--two-two', '2', '--three-three', '--four-four', '4']
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true, retainInputs: true })
  a.deepStrictEqual(result, {
    a: {
      oneOne: '1',
      twoTwo: '2'
    },
    b: {
      threeThree: true
    },
    _all: {
      oneOne: '1',
      twoTwo: '2',
      threeThree: true,
      fourFour: '4'
    },
    _none: {
      fourFour: '4'
    },
    _inputs: {
      oneOne: '1',
      twoTwo: '2',
      threeThree: null,
      fourFour: '4'
    }
  })
})

test('retain-inputs: grouped with unknowns and camelCase', function () {
  const optionDefinitions = [
    { name: 'one-one', group: 'a' },
    { name: 'two-two', group: 'a' },
    { name: 'three-three', group: 'b', type: Boolean },
    { name: 'four-four' }
  ]
  const argv = ['--one-one', '1', '--two-two', '2', '--three-three', '--four-four', '4', '--five']
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true, partial: true, retainInputs: true })
  a.deepStrictEqual(result, {
    a: {
      oneOne: '1',
      twoTwo: '2'
    },
    b: {
      threeThree: true
    },
    _all: {
      oneOne: '1',
      twoTwo: '2',
      threeThree: true,
      fourFour: '4'
    },
    _none: {
      fourFour: '4'
    },
    _unknown: ['--five'],
    _inputs: {
      oneOne: '1',
      twoTwo: '2',
      threeThree: null,
      fourFour: '4'
    }
  })
})
