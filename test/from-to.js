import { strict as a } from 'assert'
import fromTo from 'command-line-args/fromTo'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('from and to: string inputs', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here',
    to: ['rabbit', 'here', 'there'],
    inclusive: false
  })
  a.deepEqual(result, ['here', '--', '--', '--'])
})

test.set('from and to: string inputs, inclusive', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here',
    to: ['here', 'there'],
    inclusive: true
  })
  a.deepEqual(result, ['here', '--', '--', '--', 'here'])
})

test.set('from and to: function inputs', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: (val) => val === 'here',
    to: (val) => val === 'here' || val === 'there',
    inclusive: false
  })
  a.deepEqual(result, ['here', '--', '--', '--'])
})

test.set('from and to: function inputs, inclusive', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: (val) => val === 'here',
    to: (val) => val === 'here' || val === 'there',
    inclusive: true
  })
  a.deepEqual(result, ['here', '--', '--', '--', 'here'])
})

test.set('from, no to', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here'
  })
  a.deepEqual(result, ['here'])
})

test.set('from, to end', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here',
    toEnd: true
  })
  a.deepEqual(result, ['here', '--', '--', '--', 'here', '--', '--', '--', 'there'])
})

skip.set('start point', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    // start: // second "here"
    from: 'here',
    toEnd: true
  })
  a.deepEqual(result, ['here', '--', '--', '--', 'here', '--', '--', '--', 'there'])
})

skip.set('from second occurance', async function () {
  const arr = ['one', 'here', '--', '--', '--', 'here', '--', '--', '--', 'there']
  const result = fromTo(arr, {
    from: 'here',
    fromOccurance: 2,
    toEnd: true
  })
  a.deepEqual(result, ['here', '--', '--', '--', 'here', '--', '--', '--', 'there'])
})

test.set('flag', async function () {
  const arr = ['one', 'here', '--flag', 'there']
  const result = fromTo(arr, {
    from: ['--flag', '-f'],
    remove: true
  })
  a.deepEqual(result, ['--flag'])
  a.deepEqual(arr, ['one', 'here', 'there'])
})

test.set('--option value', async function () {
  const arr = ['one', 'here', '--option', 'there']
  const result = fromTo(arr, {
    from: '--option',
    to: (val) => val.startsWith('--'),
    remove: true
  })
  a.deepEqual(result, ['--option', 'there'])
  a.deepEqual(arr, ['one', 'here'])
})

export { test, only, skip }
