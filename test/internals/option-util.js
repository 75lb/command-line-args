'use strict'
const TestRunner = require('test-runner')
const optionUtil = require('../../lib/option-util')
const a = require('assert')

const runner = new TestRunner()

runner.test('optionUtil.isOption()', function () {
  a.strictEqual(optionUtil.isOption('--yeah'), true)
  a.strictEqual(optionUtil.isOption('--one-two'), true)
  a.strictEqual(optionUtil.isOption('в--yeah'), false)
  a.strictEqual(optionUtil.isOption('-y'), true)
  a.strictEqual(optionUtil.isOption('--option=value'), false)
  a.strictEqual(optionUtil.isOption('-asd'), false)
})
