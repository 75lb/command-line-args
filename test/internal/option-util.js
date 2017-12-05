'use strict'
const TestRunner = require('test-runner')
const optionUtil = require('../../lib/option-util')
const Definitions = require('../../lib/definitions')
const a = require('assert')

const runner = new TestRunner()

runner.test('optionUtil.validate()', function () {
  const definitions = Definitions.from([
    { name: 'one', type: Number }
  ])

  a.doesNotThrow(function () {
    const argv = [ '--one', '1' ]
    optionUtil.validate(definitions, {}, argv)
  })

  a.throws(function () {
    const argv = [ '--one', '--two' ]
    optionUtil.validate(definitions, {}, argv)
  })

  a.throws(function () {
    const argv = [ '--one', '2', '--two', 'two' ]
    optionUtil.validate(definitions, {}, argv)
  })

  a.throws(function () {
    const argv = [ '-a', '2' ]
    optionUtil.validate(definitions, {}, argv)
  })
})
