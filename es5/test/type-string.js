'use strict';

var TestRunner = require('test-runner');
var cliArgs = require('../../');
var a = require('core-assert');

var optionDefinitions = [{ name: 'one', type: String }];

var runner = new TestRunner();

runner.test('type-string: different values', function () {
  a.deepStrictEqual(cliArgs(optionDefinitions, ['--one', 'yeah']), { one: 'yeah' });
  a.deepStrictEqual(cliArgs(optionDefinitions, ['--one']), { one: null });
  a.deepStrictEqual(cliArgs(optionDefinitions, ['--one', '3']), { one: '3' });
});

runner.skip('type-string: pass a value resembling an option', function () {
  a.deepStrictEqual(cliArgs(optionDefinitions, ['--one', '--yeah']), { one: '--yeah' });
});