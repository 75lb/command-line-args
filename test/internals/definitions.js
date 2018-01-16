'use strict'
const TestRunner = require('test-runner')
const a = require('assert')
const Definitions = require('../../lib/option-definitions')

const runner = new TestRunner()

runner.test('.get()', function () {
  const definitions = Definitions.from([ { name: 'one', defaultValue: 'eins' } ])
  a.strictEqual(definitions.get('--one').name, 'one')
})

runner.test('.validate()', function () {
  a.throws(function () {
    const definitions = new Definitions()
    definitions.load([ { name: 'one' }, { name: 'one' } ])
  })
})
