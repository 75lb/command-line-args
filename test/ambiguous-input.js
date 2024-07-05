import TestRunner from 'test-runner'
import commandLineArgs from 'command-line-args'
import a from 'assert'

const tom = new TestRunner.Tom()

tom.test('value looks like an option 1', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: ['-c', 'red'] }), {
    colour: 'red'
  })
})

tom.test('value looks like an option 2', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  const argv = ['--colour', '--red']
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_OPTION'
  )
})

tom.test('value looks like an option 3', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.doesNotThrow(function () {
    commandLineArgs(optionDefinitions, { argv: ['--colour=--red'] })
  })
})

tom.test('value looks like an option 4', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: ['--colour=--red'] }), {
    colour: '--red'
  })
})

export default tom
