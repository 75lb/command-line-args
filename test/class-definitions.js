'use strict'
const TestRunner = require('test-runner')
const a = require('assert')
const Definitions = require('../lib/definitions')

const runner = new TestRunner()

runner.test('.createOutput()', function () {
  const definitions = new Definitions([ { name: 'one', defaultValue: 'eins' } ])
  a.deepStrictEqual(definitions.createOutput(), { one: 'eins' })
})

runner.test('.get()', function () {
  const definitions = new Definitions([ { name: 'one', defaultValue: 'eins' } ])
  a.strictEqual(definitions.get('--one').name, 'one')
})

runner.test('.validate()', function () {
  a.throws(function () {
    const definitions = new Definitions([ { name: 'one' }, { name: 'one' } ]) // eslint-disable-line no-unused-vars
  })
})
