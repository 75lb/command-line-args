import { strict as a } from 'assert'
import { fromTo, single } from '../lib/from-to.js'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('from and to: string inputs', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here',
    to: ['rabbit', 'here', 'there']
  })
  a.deepEqual(result, ['here', '--', '--', '--'])
  a.deepEqual(arr, ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there'])
})

test.set('from and to: from array', async function () {
  const arr = ['one', '-o', 'two', '-v']
  const result = fromTo(arr, {
    from: ['--option', '-o'],
    to: ['--version', '-v']
  })
  a.deepEqual(result, ['-o', 'two'])
})

test.set('from and to: from array 2', async function () {
  const arr = ['one', '-o', 'two', '--version']
  const result = fromTo(arr, {
    from: ['--option', '-o'],
    to: ['--version', '-v']
  })
  a.deepEqual(result, ['-o', 'two'])
})

test.set('from and to: function inputs', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: (val) => val === 'here',
    to: (val) => val === 'here' || val === 'there' // equivalent to [here, there]
  })
  a.deepEqual(result, ['here', '--', '--', '--'])
  a.deepEqual(arr, ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there'])
})

test.set('no to, returns all items', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here'
  })
  a.deepEqual(result, ['here', '--', '--', '--', 'here', '--', '--', '--', 'there'])
})

/* Useful for parsing a --flag. Create new config called "once" and make "from" always imply `toEnd`. Remove toEnd. */
test.set('single, no remove', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = single(arr, 'here')
  a.deepEqual(result, ['here'])
  a.deepEqual(arr, ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there'])
})

test.set('single, remove', async function () {
  const arr = ['one', 'here', '--flag', 'there']
  const result = single(arr, ['--flag', '-f'], { remove: true })
  a.deepEqual(result, ['--flag'])
  a.deepEqual(arr, ['one', 'here', 'there'])
})

test.set('--option value', async function () {
  const arr = ['one', 'here', '--option', 'there', 'more']
  const result = fromTo(arr, {
    from: '--option',
    to: (val, i, a, valueIndex) => valueIndex > 1 || val.startsWith('--'),
    remove: true
  })
  a.deepEqual(result, ['--option', 'there'])
  a.deepEqual(arr, ['one', 'here', 'more'])
})

test.set('--option value, from not found with remove set', async function () {
  const arr = ['one', 'here', '--option', 'there', 'more']
  const result = fromTo(arr, {
    from: '--not-found',
    to: (val, i, a, valueIndex) => valueIndex > 1 || val.startsWith('--'),
    remove: true
  })
  a.deepEqual(result, [])
  a.deepEqual(arr, ['one', 'here', '--option', 'there', 'more'])
})

test.set('--option value, no remove', async function () {
  const arr = ['one', 'here', '--option', 'there', 'more']
  const result = fromTo(arr, {
    from: '--option',
    to: (val, i, a, valueIndex) => valueIndex > 1 || val.startsWith('--'),
    remove: false
  })
  a.deepEqual(result, ['--option', 'there'])
  a.deepEqual(arr, ['one', 'here', '--option', 'there', 'more'])
})

test.set('--option value value ...', async function () {
  const arr = ['one', 'here', '--option', 'there', 'more']
  const result = fromTo(arr, {
    from: '--option',
    to: (val) => val.startsWith('--'),
    remove: true
  })
  a.deepEqual(result, ['--option', 'there', 'more'])
  a.deepEqual(arr, ['one', 'here'])
})

test.set('from many, to many', async function () {
  const validCommands = [
    '/help',
    '/users',
    '/rooms',
    '/clientSessions',
    '/roomSessions',
    '/members',
    '/nick',
    '/join'
  ]

  const arr = ['/join', 'roomA', '/nick', 'lloyd']
  const result = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  const result2 = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  /* Priority should be given to "first in the argv", not "first in the from list". Is order in the argv more meaningful than order in the from list? */
  a.deepEqual(result, ['/join', 'roomA'])
  a.deepEqual(result2, ['/nick', 'lloyd'])
  // this.data = { result, result2 }
})

test.set('from many, to many: order bug', async function () {
  const validCommands = [
    'dcdoc-parse',
    'add-contents',
    'add-package-list',
    'add-package-list-template',
    'body-to-file',
    'body-to-stdout',
    'combine-content',
    'combine-one-file-per-group',
    'combine-trees-single-file',
    'insert-into-template',
    'io-read',
    'io-write',
    'package-info',
    'quick-table',
    'render-block',
    'read-step-data',
    'filter-blocks'
  ]

  const arr = ['io-read', '--inputs', 'clive.json', 'dcdoc-parse', 'combine-content', 'insert-into-template', '--template', 'clive.template']
  const result = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  const result2 = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  const result3 = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  const result4 = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  /* Priority should be given to "first in the argv", not "first in the from list". Is order in the argv more meaningful than order in the from list? */
  // this.data = { result, result2, result3, result4 }
  a.deepEqual({ result, result2, result3, result4 }, {
    result: ['io-read', '--inputs', 'clive.json'],
    result2: ['dcdoc-parse'],
    result3: ['combine-content'],
    result4: ['insert-into-template', '--template', 'clive.template']
  })
})

test.set('from many, to many: order bug, dcdoc-parse moved to end of list', async function () {
  const validCommands = [
    'add-contents',
    'add-package-list',
    'add-package-list-template',
    'body-to-file',
    'body-to-stdout',
    'combine-content',
    'combine-one-file-per-group',
    'combine-trees-single-file',
    'insert-into-template',
    'io-read',
    'io-write',
    'package-info',
    'quick-table',
    'render-block',
    'read-step-data',
    'filter-blocks',
    'dcdoc-parse'
  ]

  const arr = ['io-read', '--inputs', 'clive.json', 'dcdoc-parse', 'combine-content', 'insert-into-template', '--template', 'clive.template']
  debugger
  const result = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  const result2 = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  const result3 = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  const result4 = fromTo(arr, {
    from: validCommands,
    to: validCommands,
    remove: true
  })
  /* Priority should be given to "first in the argv", not "first in the from list". Is order in the argv more meaningful than order in the from list? */
  // this.data = { result, result2, result3, result4 }
  a.deepEqual({ result, result2, result3, result4 }, {
    result: ['io-read', '--inputs', 'clive.json'],
    result2: ['dcdoc-parse'],
    result3: ['combine-content'],
    result4: ['insert-into-template', '--template', 'clive.template']
  })
})

export { test, only, skip }
