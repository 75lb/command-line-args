import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('groups', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three', group: 'b' }
  ]
  const argv = ['--one', '1', '--two', '2', '--three', '3']
  const output = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(output, {
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
  const definitions = [
    { name: 'one', group: ['a', 'f'] },
    { name: 'two', group: ['a', 'g'] },
    { name: 'three' }
  ]

  a.deepStrictEqual(commandLineArgs(definitions, { argv: ['--one', '1', '--two', '2', '--three', '3'] }), {
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

runner.test('groups: nothing set', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three', group: 'b' }
  ]
  const argv = []
  const output = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(output, {
    a: {},
    b: {},
    _all: {}
  })
})

runner.test('groups: nothing set with one ungrouped', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three' }
  ]
  const argv = []
  const output = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(output, {
    a: {},
    _all: {}
  })
})

runner.test('groups: two ungrouped, one set', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three' },
    { name: 'four' }
  ]
  const argv = ['--three', '3']
  const output = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(output, {
    a: {},
    _all: { three: '3' },
    _none: { three: '3' }
  })
})

runner.test('groups: two ungrouped, both set', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three' },
    { name: 'four' }
  ]
  const argv = ['--three', '3', '--four', '4']
  const output = commandLineArgs(definitions, { argv })
  a.deepStrictEqual(output, {
    a: {},
    _all: { three: '3', four: '4' },
    _none: { three: '3', four: '4' }
  })
})

runner.test('groups: with partial', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three', group: 'b' }
  ]
  const argv = ['--one', '1', '--two', '2', '--three', '3', 'ham', '--cheese']
  a.deepStrictEqual(commandLineArgs(definitions, { argv, partial: true }), {
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
    },
    _unknown: ['ham', '--cheese']
  })
})

runner.test('partial: with partial, multiple groups and _none', function () {
  const definitions = [
    { name: 'one', group: ['a', 'f'] },
    { name: 'two', group: ['a', 'g'] },
    { name: 'three' }
  ]
  const argv = ['--cheese', '--one', '1', 'ham', '--two', '2', '--three', '3', '-c']
  a.deepStrictEqual(commandLineArgs(definitions, { argv, partial: true }), {
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
    },
    _unknown: ['--cheese', 'ham', '-c']
  })
})
