import TestRunner from 'test-runner'
import commandLineArgs from '../index.mjs'
import a from 'assert'

const runner = new TestRunner()

runner.test('ambiguous input: value looks like an option 1', function () {
  const optionDefinitions = [
    { name: 'colour', alias: 'c' }
  ]
  const argv = [ '-c', 'red' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colour: 'red'
  })
})

runner.test('ambiguous input: value looks like an option 2', function () {
  const optionDefinitions = [
    { name: 'colour', alias: 'c' }
  ]
  const argv = [ '--colour', '--red' ]
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_OPTION'
  )
})

runner.test('ambiguous input: value looks like an option 3', function () {
  const optionDefinitions = [
    { name: 'colour', alias: 'c' }
  ]
  const argv = [ '--colour=--red' ]
  a.doesNotThrow(function () {
    commandLineArgs(optionDefinitions, { argv })
  })
})

runner.test('ambiguous input: value looks like an option 4', function () {
  const optionDefinitions = [
    { name: 'colour', alias: 'c' }
  ]
  const argv = [ '--colour=--red' ]
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colour: '--red'
  })
})
