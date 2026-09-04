import { strict as a } from 'assert'
import CommandLineArgs from 'command-line-args'
import util from 'node:util'
util.inspect.defaultOptions.depth = 6
util.inspect.defaultOptions.breakLength = process?.stdout?.columns || 80
util.inspect.defaultOptions.maxArrayLength = Infinity

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('single --option flag, value set', async function () {
  const argv = ['one', 'two', '--one', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'single',
      single: '--one',
      output: extraction => extraction.length === 1 ? true : undefined
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, { one: true })
  a.deepEqual(cla.argv, ['one', 'two', '--two'])
})

test.set('single --option flag, value set not, output returns false', async function () {
  const argv = ['one', 'two', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'single',
      single: '--one',
      output: extraction => extraction.length === 1
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, { one: false })
  a.deepEqual(cla.argv, ['one', 'two', '--two'])
})

test.set('single --option flag, not set. Returning undefined omits option from result.', async function () {
  const argv = ['one', 'two', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'single',
      single: '--one',
      output: extraction => extraction.length === 1 ? true : undefined
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, {})
  a.deepEqual(cla.argv, ['one', 'two', '--two'])
})

test.set('single regex', async function () {
  const argv = ['one', 'two', '--one', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'single',
      single: /--o[n]+e/,
      output: extraction => true
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, { one: true })
  a.deepEqual(cla.argv, ['one', 'two', '--two'])

  const argv2 = ['one', 'two', '--onnnnne', '--two']
  const cla2 = new CommandLineArgs(argv2)
  const result2 = cla2.parse(optionDefinitions)
  a.deepEqual(result, { one: true })
  a.deepEqual(cla.argv, ['one', 'two', '--two'])
})

test.set('--option flag not present', async function () {
  const argv = ['one', 'two', '--not-one', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'single',
      single: '--one',
      output: extraction => extraction.length === 1
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, { one: false })
  a.deepEqual(cla.argv, ['one', 'two', '--not-one', '--two'])
})

test.set('Repeatable singles, raw output', async function () {
  const argv = ['--var', 'one', 'something', '--var', 'two', 'another', '--var']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'var',
      extractor: 'single',
      single: '--var',
      repeatable: true,
      output: e => e
    }
  ])

  // this.data = result
  a.deepEqual(result, { var: [['--var'], ['--var'], ['--var']] })
})

test.set('Repeatable singles, boolean output', async function () {
  const argv = ['--var', 'one', 'something', '--var', 'two', 'another', '--var']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'var',
      extractor: 'single',
      single: '--var',
      repeatable: true,
      output: e => e.map(i => i.length === 1)
    }
  ])

  // this.data = result
  a.deepEqual(result, { var: [true, true, true] })
})

export { test, only, skip }
