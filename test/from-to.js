import { strict as a } from 'assert'
import { fromTo, single } from '../lib/from-to.js'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('from and to: string inputs', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here',
    to: ['rabbit', 'here', 'there'] // "to" implies one or more values expected. TODO: multiplicity config instread? E.g. `1..*` like UML.
  })
  a.deepEqual(result, ['here', '--', '--', '--'])
  a.deepEqual(arr, ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there'])
})

test.set('from and to: function inputs', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: (val) => val === 'here',
    to: (val) => val === 'here' || val === 'there'
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

skip.set('from second occurance', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here',
    fromOccurance: 2 // TODO: NOT IMPLEMENTED. DEPRECATED? Implement by passing in an array which already starts from the second occurance?
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
  /* Priority should be given to "first in the array", not "first in the from list". Is order in the argv more meaningful than order in the from list? */
  a.deepEqual(result, ['/join', 'roomA'])
  a.deepEqual(result2, ['/nick', 'lloyd'])
  // this.data = { result, result2 }
})

export { test, only, skip }
