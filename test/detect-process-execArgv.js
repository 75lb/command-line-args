import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('should automatically remove first argv items', function () {
  const origArgv = process.argv
  const origExecArgv = process.execArgv
  process.argv = ['node', '--one', 'eins']
  process.execArgv = ['-e', 'something']
  a.deepStrictEqual(commandLineArgs({ name: 'one' }), {
    one: 'eins'
  })
  process.argv = origArgv
  process.execArgv = origExecArgv
})

export default tom
