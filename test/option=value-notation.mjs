import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('--option=value notation: two plus a regular notation', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'three' }
  ]

  const argv = ['--one=1', '--two', '2', '--three=3']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.strictEqual(result.one, '1')
  a.strictEqual(result.two, '2')
  a.strictEqual(result.three, '3')
})

runner.test('--option=value notation: value contains "="', function () {
  const optionDefinitions = [
    { name: 'url' },
    { name: 'two' },
    { name: 'three' }
  ]

  let result = commandLineArgs(optionDefinitions, { argv: ['--url=my-url?q=123', '--two', '2', '--three=3'] })
  a.strictEqual(result.url, 'my-url?q=123')
  a.strictEqual(result.two, '2')
  a.strictEqual(result.three, '3')

  result = commandLineArgs(optionDefinitions, { argv: ['--url=my-url?q=123=1'] })
  a.strictEqual(result.url, 'my-url?q=123=1')

  result = commandLineArgs({ name: 'my-url' }, { argv: ['--my-url=my-url?q=123=1'] })
  a.strictEqual(result['my-url'], 'my-url?q=123=1')
})
