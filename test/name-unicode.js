import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('unicode names and aliases are permitted', function () {
  const optionDefinitions = [
    { name: 'один' },
    { name: '两' },
    { name: 'три', alias: 'т' }
  ]
  const argv = ['--один', '1', '--两', '2', '-т', '3']
  const result = commandLineArgs(optionDefinitions, { argv })
  a.strictEqual(result.один, '1')
  a.strictEqual(result.两, '2')
  a.strictEqual(result.три, '3')
})

export default tom
