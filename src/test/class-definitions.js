'use strict'
const TestRunner = require('test-runner')
const detect = require('feature-detect-es6')
const a = require('core-assert')
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
    const definitions = new Definitions([ { name: 'one' }, { name: 'one' } ])
  })
})
