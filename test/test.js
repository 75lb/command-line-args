import { strict as a } from 'assert'
import CommandLineArgs from 'command-line-args'
import util from 'node:util'
util.inspect.defaultOptions.depth = 6
util.inspect.defaultOptions.breakLength = process?.stdout?.columns || 80
util.inspect.defaultOptions.maxArrayLength = Infinity

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('Input argv is not mutated', async function () {
  const argv = ['one', 'two', '--one', 'something', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'fromTo',
      from: '--one',
      toPreset: 'singleOptionValue',
      output: extraction => extraction[1]
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.notEqual(cla.argv, argv)
  a.notEqual(cla.argv.length, argv.length)
  a.deepEqual(result, { one: 'something' })
})

test.set('--option <no value>', async function () {
  const argv = ['one', 'two', '--one', '--two', 'three']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'fromTo',
      from: '--one',
      toPreset: 'singleOptionValue',
      output: extraction => extraction[1]
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, { one: undefined })
  a.deepEqual(cla.argv, ['one', 'two', '--two', 'three'])
})

test.set('Positionals must be args 1 and 2, with options following', async function () {
  const argv = ['positional1', '100', '--option', '4', '--flag', 'unwanted']

  const optionDefinitions = [
    {
      name: 'positional1',
      extractor: 'positional',
      position: 1,
      output: e => e[0]
    },
    {
      name: 'positional2',
      extractor: 'positional',
      position: 2,
      output: e => e[0]
    },
    {
      name: 'option',
      extractor: 'fromTo',
      from: ['--option', '-o'],
      toPreset: 'singleOptionValue',
      output: extraction => extraction[1]
    },
    {
      name: 'flag',
      extractor: 'single',
      single: '--flag',
      output: e => true
    }
    // {
    //   name: 'remainder',
    //   extractor: 'remainder'
    // }
  ]

  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, {
    positional2: '100',
    positional1: 'positional1',
    option: '4',
    flag: true
  })

  // this.data = { result }
})

test.set('Positional with one single', async function () {
  const argv = ['AAPL', '--contract']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'contract',
      extractor: 'single',
      single: '--contract',
      output: extraction => true
    },
    {
      name: 'symbol',
      extractor: 'positional',
      position: 1,
      output: extraction => extraction[0]
    }
  ])
  a.deepEqual(result, { symbol: 'AAPL', contract: true })
})

test.set('Positional, one single, one from-to', async function () {
  const argv = ['AAPL', '--contract']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'contract',
      extractor: 'single',
      single: '--contract',
      output: extraction => true
    },
    {
      name: 'symbol',
      extractor: 'positional',
      position: 1,
      output: extraction => extraction[0]
    },
    {
      name: 'exchange',
      extractor: 'fromTo',
      from: '--exchange',
      toPreset: 'singleOptionValue',
      output: extraction => extraction[1]
    }
  ])
  a.deepEqual(result, { symbol: 'AAPL', contract: true, exchange: undefined })
})

test.set('Missing positional with one single', async function () {
  const argv = ['--contract']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'contract',
      extractor: 'single',
      single: '--contract',
      output: extraction => true
    },
    {
      name: 'symbol',
      extractor: 'positional',
      position: 1,
      output: extraction => extraction[0]
    }
  ])
  a.deepEqual(result, { contract: true, symbol: undefined })
})

test.set('Magic arg values: file1 file2 extra-large verbose output final', async function () {
  const argv = ['srcFile', 'destFile', 'extra-large', 'verbose', 'output', 'final', 'unwanted']

  const optionDefinitions = [
    {
      name: 'src',
      extractor: 'positional',
      position: 1,
      output: e => e[0]
    },
    {
      name: 'dest',
      extractor: 'positional',
      position: 2,
      output: e => e[0]
    },
    {
      name: 'preset',
      extractor: 'single',
      single: ['large', 'extra-large'],
      output: extraction => extraction[0]
    },
    {
      name: 'verbose',
      extractor: 'single',
      single: 'verbose',
      output: extraction => true
    },
    {
      name: 'output',
      extractor: 'fromTo',
      from: 'output',
      toPreset: 'singleOptionValue',
      output: extraction => extraction[1]
    }
    // {
    //   name: 'files'
    // }
  ]

  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, {
    dest: 'destFile',
    src: 'srcFile',
    preset: 'extra-large',
    verbose: true,
    output: 'final'
  })
  a.deepEqual(cla.argv, ['unwanted'])
})

skip.set('Preprocessing', async function () {
  // const argv = ['b25lIHR3byAtLW9uZSBzb21ldGhpbmcgLS10d28K'] // or a JWT
  // echo 'one two --one something --two' | base64
})

skip.set('Preprocessing: short flag combos', async function () {
})

/* In cases where the app doesn't know the definitions (e.g. it loaded a plugin which didn't define its args) but the user does. Lws uses this. */
test.set('self-defining options', async function () {
  const argv = [
    '--port',
    '8000',
    '--server.string[].one',
    'one',
    'uno',
    'ein',
    '--config',
    '--server.number.two',
    '--server.number.broke',
    '1',
    '--server.flags.three',
    'sad',
    '--server.string.four',
    'four',
    '--port',
    '3000'
  ]

  /* Instead of "dynamic definition" magic, just run the parser over argv multiple times, one for each desired result object */
  /* Parse the args first for `--configName.optionName.optionValueType` format args, creating option definitions */

  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'fromTo',
      from: /^--server\.string\[\]/,
      toPreset: 'multipleOptionValue',
      output: e => e.slice(1)
    },
    {
      name: 'two',
      extractor: 'fromTo',
      from: /^--server\.number\./,
      toPreset: 'singleOptionValue',
      output: e => e[1]
    },
    {
      name: 'broke',
      extractor: 'fromTo',
      from: /^--server\.number\./,
      toPreset: 'singleOptionValue',
      output: e => Number(e[1])
    },
    {
      name: 'three',
      extractor: 'single',
      single: /--server\.flag/,
      output: e => true
    },
    {
      name: 'four',
      extractor: 'fromTo',
      from: /^--server\.string\./,
      toPreset: 'singleOptionValue',
      output: e => e[1]
    }
  ]

  const cla = new CommandLineArgs(argv)
  const result = await cla.parse(optionDefinitions)
  a.deepEqual(result, {
    one: ['one', 'uno', 'ein'],
    two: undefined,
    broke: 1,
    three: true,
    four: 'four'
  })
})

/* outdated */
skip.set('no name supplied: use the fromArg as the default', async function () {
  const argv = ['one', 'two', '--one', 'something', '--two']
  const optionDefinitions = [
    {
      from: arg => arg === '--one',
      to: (valueIndex, arg) => valueIndex === 1 && !arg.startsWith('--'),
      type: values => values[0]
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = await cla.parse()
  a.deepEqual(result, { '--one': 'something' })
  a.deepEqual(cla.argv, ['one', 'two', '--two'])
})

/**
 * Is this necessary?
 */
skip.set('name can be a function receiving the extraction matched by from and to', async function () {
  const argv = ['one', 'two', '--one', 'first', 'second', '--two']
  const optionDefinitions = [
    {
      from: arg => arg === '--one',
      to: (valueIndex, arg, index, argv) => argv[index + 1] && argv[index + 1].startsWith('--'),
      name: (extraction) => extraction.join('|')
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = await cla.parse()
  a.deepEqual(result, { '--one|first|second': ['first', 'second'] })
})

skip.set('to not found: no args matched', async function () {
  const argv = ['command1', 'arg', '--option', 'value', '--flag']
  const optionDefinitions = [
    {
      from: arg => arg === 'command1',
      to: () => false
    }
  ]
  const cla = new CommandLineArgs(argv, optionDefinitions)
  const result = await cla.parse()
  // this.data = result
  a.deepEqual(result, {
    command1: []
  })
})

test.set('Multiple parses to consume all args', async function () {
  const argv = ['server', '--option', 'value', 'clive', 'server', '--verbose']
  const cla = new CommandLineArgs(argv)
  const result1 = await cla.parse([
    {
      name: 'extraction',
      extractor: 'fromTo',
      from: 'server',
      to: 'server'
    }
  ])
  const result2 = await cla.parse([
    {
      name: 'extraction',
      extractor: 'fromTo',
      from: 'server',
      to: 'server'
    }
  ])
  // this.data = { result1, result2 }

  a.deepEqual(result1, { extraction: ['server', '--option', 'value', 'clive'] })
  a.deepEqual(result2, { extraction: ['server', '--verbose'] })
})

test.set('Repeatable multis', async function () {
  const argv = ['--var', 'one', 'something', '--var', 'two', 'another']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'var',
      extractor: 'fromTo',
      from: '--var',
      toPreset: 'multipleOptionValue',
      repeatable: true,
      output: e => e
    }
  ])
  // this.data = result
  a.deepEqual(result, { var: [['--var', 'one', 'something'], ['--var', 'two', 'another']] })
})

test.set('Repeatable multis, converted to object', async function () {
  const argv = ['--var', 'one', 'something', '--var', 'two', 'another']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'var',
      extractor: 'fromTo',
      from: '--var',
      toPreset: 'multipleOptionValue',
      repeatable: true,
      output: e => Object.fromEntries(e.map(args => args.slice(1)))
    }
  ])

  a.deepEqual(result, { var: { one: 'something', two: 'another' } })
})

test.set('Repeatable single option values', async function () {
  const argv = ['--var', 'one', 'something', '--var', 'two', 'another', '--var']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'var',
      extractor: 'fromTo',
      from: '--var',
      toPreset: 'singleOptionValue',
      repeatable: true,
      output: e => e
    }
  ])

  // this.data = result
  a.deepEqual(result, { var: [['--var', 'one'], ['--var', 'two'], ['--var']] })
})

test.set('Repeating single option values without repeatable set', async function () {
  const argv = ['--var', 'one', 'something', '--var', 'two', 'another', '--var']
  const cla = new CommandLineArgs(argv)
  const result = await cla.parse([
    {
      name: 'var',
      extractor: 'fromTo',
      from: '--var',
      toPreset: 'singleOptionValue',
      output: e => e
    }
  ])

  // this.data = result
  a.deepEqual(result, { var: ['--var', 'one'] })
})

export { test, only, skip }
