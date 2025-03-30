import { strict as a } from 'assert'
import CommandLineArgs from 'command-line-args'
import { fromTo, single, positional } from 'command-line-args/fromTo'

const [test, only, skip] = [new Map(), new Map(), new Map()]

function singleOptionValuePreset (arg, index, argv, valueIndex) {
  return valueIndex > 1 || arg.startsWith('--')
}

function multipleOptionValuePreset (arg, index, argv, valueIndex) {
  return arg.startsWith('--')
}

/* Each element in optionDefinitions should be a from-to config set. The output of which can be cleaned and named separately, i.e. naming each result "file", "verbose" etc and fixing the type of each value. */

test.set('Input argv is not mutated', async function () {
  const argv = ['one', 'two', '--one', 'something', '--two']
  // const optionDefinitions = [
  //   {
  //     name: 'one',
  //     from: arg => arg === '--one',
  //     to: (valueIndex, arg) => valueIndex === 1 && !arg.startsWith('--'),
  //     type: values => values[0]
  //   }
  // ]
  // const cla = new CommandLineArgs(argv, optionDefinitions)
  // const result = cla.parse()
  // a.notEqual(cla.args, argv)
  // a.notEqual(cla.args.length, argv.length)

  const result = fromTo(argv, {
    from: '--one',
    to: singleOptionValuePreset,
    remove: true
  })
  this.data = { result, argv }
})

test.set('--option <no value>', async function () {
  const argv = ['one', 'two', '--one', '--two', 'three']
  // const optionDefinitions = [
  //   {
  //     name: 'one',
  //     from: arg => arg === '--one',
  //     to: (valueIndex, arg) => valueIndex === 1 && !arg.startsWith('--'),
  //     type: values => values[0]
  //   }
  // ]
  // const cla = new CommandLineArgs(argv, optionDefinitions)
  // const result = cla.parse()
  // // this.data = {result, cla}
  // a.deepEqual(result, { one: undefined })
  // a.deepEqual(cla.args, ['one', 'two', '--two'])

  const result = fromTo(argv, {
    from: '--one',
    to: singleOptionValuePreset,
    remove: true
  })
  this.data = { result, argv }
})

test.set('--option flag', async function () {
  const argv = ['one', 'two', '--one', '--two']
  // const optionDefinitions = [
  //   {
  //     name: 'one',
  //     from: arg => arg === '--one',
  //     type: values => true
  //   }
  // ]
  // const cla = new CommandLineArgs(argv, optionDefinitions)
  // const result = cla.parse()
  // a.deepEqual(result, { one: true })
  // a.deepEqual(cla.args, ['one', 'two', '--two'])

  const result = single(argv, '--one', { remove: true })
  this.data = { result, argv }
})

test.set('--option flag not present', async function () {
  const argv = ['one', 'two', '--not-one', '--two']
  // const optionDefinitions = [
  //   {
  //     name: 'one',
  //     from: arg => arg === '--one',
  //     type: values => true
  //   }
  // ]
  // const cla = new CommandLineArgs(argv, optionDefinitions)
  // const result = cla.parse()
  // a.deepEqual(result, {})
  // a.deepEqual(cla.args, ['one', 'two', '--not-one', '--two'])

  const result = single(argv, '--one', { remove: true })
  this.data = { result, argv }
})

test.set('file1 file2 --preset <value> --flag', async function () {
  const argv = ['file1', 'file2', '--preset', '1', '--flag']

  /* how optionDefinitions might look */
  const optionDefinitions = [
    {
      name: 'preset',
      from: '--preset',
      to: singleOptionValuePreset,
      type: Number
    },
    {
      name: 'flag',
      single: ['--flag', '-f'],
      value: true
    },
    {
      name: 'files'
      /* collects the remainder of unparsed args? */
    }
  ]

  const extractions = [
    fromTo(argv, {
      from: '--preset',
      to: singleOptionValuePreset,
      remove: true
    }),
    single(argv, '--flag', { remove: true }),
    argv
  ]

  this.data = { extractions }
})

test.set('Magic arg values: file1 file2 extra-large verbose output final', async function () {
  const argv = ['srcFile', 'destFile', 'extra-large', 'verbose', 'output', 'final', 'unwanted']

  /* how optionDefinitions might look */
  const optionDefinitions = [
    {
      name: 'preset',
      single: ['large', 'extra-large']
      // value defaults to the single arg matched, e.g. 'large'
    },
    {
      name: 'verbose',
      single: 'verbose',
      value: true // value hard-coded to true, overriding the default matched arg
    },
    {
      name: 'output',
      from: 'output',
      to: singleOptionValuePreset
    },
    {
      name: 'files' // remainder, not including 'unwanted'. How to implement that? You can't - manually validate the collected args.
    }
  ]

  const extractions = [
    single(argv, ['large', 'extra-large'], { remove: true }),
    single(argv, 'verbose', { remove: true }),
    fromTo(argv, {
      from: 'output',
      to: singleOptionValuePreset,
      remove: true
    }),
    argv
  ]

  this.data = { extractions }
})

test.set('Positionals must be args 1 and 2, with options following', async function () {
  const argv = ['positional1', '100', '--option', '4', '--flag', 'unwanted']

  const optionDefinitions = [
    {
      name: 'positional1',
      extractor: 'positional',
      position: 1,
      type: String
    },
    {
      name: 'positional2',
      extractor: 'positional',
      position: 2,
      type: Number
    },
    {
      name: 'option',
      extractor: 'fromTo',
      from: ['--option', '-o'],
      to: singleOptionValuePreset,
      type: Number
    },
    {
      name: 'flag',
      extractor: 'single',
      single: '--flag',
      type: () => true
    },
    {
      name: 'remainder',
      extractor: 'remainder'
    }
  ]

  const extractions = [
    positional(argv, 0, { remove: true }),
    positional(argv, 0, { remove: true }), // 0, not 1 because the above removed 1
    fromTo(argv, {
      from: ['--option', '-o'],
      to: singleOptionValuePreset,
      remove: true
    }),
    single(argv, '--flag', { remove: true }),
    argv
  ]

  /* Building result uses definition name and type function */
  const result = {
    positional1: String(extractions[0][0]),
    positional2: Number(extractions[1][0]),
    option: Number(extractions[2][1]),
    flag: (() => true)(),
    remainder: argv
  }

  this.data = { extractions, result }
})

skip.set('Preprocessing', async function () {
  const argv = ['b25lIHR3byAtLW9uZSBzb21ldGhpbmcgLS10d28K']
  // echo 'one two --one something --two' | base64
})

/* In cases where the app doesn't know the definitions (e.g. it loaded a plugin which didn't define its args) but the user does. Lws uses this. */
only.set('self-defining options', async function () {
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
    '--server.flag.three',
    'sad',
    '--server.string.four',
    'four',
    '--port',
    '3000'
  ]

  /* Instead of "dynamic definition" magic, just run the parser over argv multiple times, one for each desire result object */
  /* Parse the args first for `--configName.optionName.optionValueType` format args, creating option definitions */

  const extractionResultMap = new Map()

  const serverExtractions = [
    fromTo(argv, {
      from: /^--server\.string\[\]/,
      to: multipleOptionValuePreset,
      remove: true
    }),
    fromTo(argv, {
      from: /^--server\.number\./,
      to: singleOptionValuePreset,
      remove: true
    }),
    fromTo(argv, {
      from: /^--server\.number\./,
      to: singleOptionValuePreset,
      remove: true
    }),
    single(argv, /--server\.flag/, { remove: true }),
    fromTo(argv, {
      from: /^--server\.string\./,
      to: singleOptionValuePreset,
      remove: true
    }),
  ]

  /* Building result uses user-definition name and type */
  const serverResult = {
    one: serverExtractions[0].slice(1).map(String),
    two: Number(serverExtractions[1][1]), // not a slice as not an array type
    broke: Number(serverExtractions[2][1]),
    three: (() => true)(),
    four: String(serverExtractions[4][1])
  }

  this.data = { serverExtractions, serverResult, argv }
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
  a.deepEqual(cla.args, ['one', 'two', '--two'])
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
