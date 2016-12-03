'use strict';

var TestRunner = require('test-runner');
var a = require('core-assert');
var option = require('../lib/option');

var runner = new TestRunner();

runner.test('option', function () {
  a.strictEqual(option.isOption('--yeah'), true);
  a.strictEqual(option.isOption('в--yeah'), false);
});