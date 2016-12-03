'use strict'
const TestRunner = require('test-runner')
const cliArgs = require('../../')
const a = require('core-assert')

const optionDefinitions = [
  { name: 'one', group: 'a' },
  { name: 'two', group: 'a' },
  { name: 'three', group: 'b' }
]

const runner = new TestRunner()

runner.test('groups', function () {
  a.deepStrictEqual(cliArgs(optionDefinitions, [ '--one', '1', '--two', '2', '--three', '3' ]), {
    a: {
      one: '1',
      two: '2'
    },
    b: {
      three: '3'
    },
    _all: {
      one: '1',
      two: '2',
      three: '3'
    }
  })
})

runner.test('groups: multiple and _none', function () {
  const optionDefinitions = [
    { name: 'one', group: ['a', 'f'] },
    { name: 'two', group: ['a', 'g'] },
    { name: 'three' }
  ]

  a.deepStrictEqual(cliArgs(optionDefinitions, [ '--one', '1', '--two', '2', '--three', '3' ]), {
    a: {
      one: '1',
      two: '2'
    },
    f: {
      one: '1'
    },
    g: {
      two: '2'
    },
    _none: {
      three: '3'
    },
    _all: {
      one: '1',
      two: '2',
      three: '3'
    }
  })
})
