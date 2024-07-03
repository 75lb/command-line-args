import commandLineArgs from '../index.mjs'
import a from 'assert'


test('detect process.execArgv: should automatically remove first argv items', function () {
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
