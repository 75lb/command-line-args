import { strict as a } from 'assert'
import CommandLineArgs from 'command-line-args'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('Input argv is not mutated', async function () {
  const argv = ['one', 'two', '--one', 'something', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      from: arg => arg === '--one',
      to: (valueIndex, arg) => valueIndex === 1 && !arg.startsWith('--'),
      type: values => values[0]
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  a.notEqual(cla.args, argv)
  a.notEqual(cla.args.length, argv.length)
})

test.set('--option <no value>', async function () {
  const argv = ['one', 'two', '--one', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      from: arg => arg === '--one',
      to: (valueIndex, arg) => valueIndex === 1 && !arg.startsWith('--'),
      type: values => values[0]
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  // this.data = {result, cla}
  a.deepEqual(result, { one: undefined })
  a.deepEqual(cla.args, ['one', 'two', '--two'])
})

test.set('--option flag', async function () {
  const argv = ['one', 'two', '--one', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      from: arg => arg === '--one',
      type: values => true
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  a.deepEqual(result, { one: true })
  a.deepEqual(cla.args, ['one', 'two', '--two'])
})

test.set('--option flag not present', async function () {
  const argv = ['one', 'two', '--not-one', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      from: arg => arg === '--one',
      type: values => true
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  a.deepEqual(result, {})
  a.deepEqual(cla.args, ['one', 'two', '--not-one', '--two'])
})

test.set('--option <value>', async function () {
  const argv = ['one', 'two', '--one', 'something', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      from: arg => arg === '--one',
      to: (valueIndex, arg) => valueIndex === 1 && !arg.startsWith('--'),
      type: values => values[0]
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  a.deepEqual(result, { one: 'something' })
  a.deepEqual(cla.args, ['one', 'two', '--two'])
})

test.set('no name supplied: use the fromArg as the default', async function () {
  const argv = ['one', 'two', '--one', 'something', '--two']
  const optionDefinitions = [
    {
      from: arg => arg === '--one',
      to: (valueIndex, arg) => valueIndex === 1 && !arg.startsWith('--'),
      type: values => values[0]
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  a.deepEqual(result, { '--one': 'something' })
  a.deepEqual(cla.args, ['one', 'two', '--two'])
})

test.set('Missing type: all args to the right of the fromArg returned', async function () {
  const argv = ['one', 'two', '--one', 'first', 'second', '--two']
  const optionDefinitions = [
    {
      from: arg => arg === '--one',
      to: (valueIndex, arg, index, argv) => argv[index + 1]?.startsWith('--')
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  a.deepEqual(result, { '--one': ['first', 'second'] })
  a.deepEqual(cla.args, ['one', 'two', '--two'])
})

test.set('name can be a function receiving the extraction matched by from and to', async function () {
  const argv = ['one', 'two', '--one', 'first', 'second', '--two']
  const optionDefinitions = [
    {
      from: arg => arg === '--one',
      to: (valueIndex, arg, index, argv) => argv[index + 1]?.startsWith('--'),
      name: (extraction) => extraction.join('|')
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  a.deepEqual(result, { '--one|first|second': ['first', 'second'] })
})

test.set('dynamic definition function receives fromArg', async function () {
  const argv = ['one', 'two', '--one', 'something', '--two']
  const optionDefinitions = [
    {
      from: arg => arg === '--one',
      def: fromArg => {
        a.equal(fromArg, '--one')
        return {
          to: (valueIndex, arg) => valueIndex === 1,
          name: 'one',
          type: values => values[0]
        }
      }
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  a.deepEqual(result, { 'one': 'something' })
  a.deepEqual(cla.args, ['one', 'two', '--two'])
})

test.set('noFurtherThan', async function () {
  const argv = ['command1', 'arg', '--option', 'value', '--flag', 'command2', 'arg2']
  const commands = ['command1', 'command2']
  const optionDefinitions = [
    {
      from: arg => commands.includes(arg),
      noFurtherThan: (valueIndex, arg, index, argv) => commands.includes(arg)
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  // this.data = result
  a.deepEqual(result, {
    command1: ['arg', '--option', 'value', '--flag'],
    command2: ['arg2']
  })
})

test.set('to not found: no args matched', async function () {
  const argv = ['command1', 'arg', '--option', 'value', '--flag']
  const optionDefinitions = [
    {
      from: arg => arg === 'command1',
      to: () => false
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  // this.data = result
  a.deepEqual(result, {
    command1: []
  })
})

test.set('noFurtherThan not found: all args matched until the end', async function () {
  const argv = ['command1', 'arg', '--option', 'value', '--flag']
  const optionDefinitions = [
    {
      from: arg => arg === 'command1',
      noFurtherThan: () => false
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = cla.parse()
  // this.data = result
  a.deepEqual(result, {
    command1: [ 'arg', '--option', 'value', '--flag' ]
  })
})

export { test, only, skip }
