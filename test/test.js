import { strict as a } from 'assert'
import CommandLineArgs from 'command-line-args'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('Input argv is not mutated', async function () {
  const argv = ['one', 'two', '--one', 'something', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'fromTo',
      from: '--one',
      to: 'singleOptionValue',
      type: String,
      output: extraction => extraction[1]
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = cla.parse(optionDefinitions)
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
      to: 'singleOptionValue',
      output: extraction => extraction[1]
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = cla.parse(optionDefinitions)
  a.deepEqual(result, { one: undefined })
  a.deepEqual(cla.argv, ['one', 'two', '--two', 'three'])
})

test.set('--option flag', async function () {
  const argv = ['one', 'two', '--one', '--two']
  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'single',
      single: '--one',
      output: extraction => true
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = cla.parse(optionDefinitions)
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
      output: extraction => true
    }
  ]
  const cla = new CommandLineArgs(argv)
  const result = cla.parse(optionDefinitions)
  a.deepEqual(result, {})
  a.deepEqual(cla.argv, ['one', 'two', '--not-one', '--two'])
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
      to: 'singleOptionValue',
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
  const result = cla.parse(optionDefinitions)
  a.deepEqual(result, {
    positional2: '100',
    positional1: 'positional1',
    option: '4',
    flag: true
  })

  // this.data = { result }
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
      to: 'singleOptionValue',
      output: extraction => extraction[1]
    }
    // {
    //   name: 'files'
    // }
  ]

  const cla = new CommandLineArgs(argv)
  const result = cla.parse(optionDefinitions)
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

  /* Instead of "dynamic definition" magic, just run the parser over argv multiple times, one for each desire result object */
  /* Parse the args first for `--configName.optionName.optionValueType` format args, creating option definitions */

  const optionDefinitions = [
    {
      name: 'one',
      extractor: 'fromTo',
      from: /^--server\.string\[\]/,
      to: 'multipleOptionValue',
      output: e => e.slice(1)
    },
    {
      name: 'two',
      extractor: 'fromTo',
      from: /^--server\.number\./,
      to: 'singleOptionValue',
      output: e => e[1]
    },
    {
      name: 'broke',
      extractor: 'fromTo',
      from: /^--server\.number\./,
      to: 'singleOptionValue',
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
      to: 'singleOptionValue',
      output: e => e[1]
    }
  ]

  const cla = new CommandLineArgs(argv)
  const result = cla.parse(optionDefinitions)
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
  const result = cla.parse()
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
  const result = cla.parse()
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
  const result = cla.parse()
  // this.data = result
  a.deepEqual(result, {
    command1: []
  })
})

export { test, only, skip }
