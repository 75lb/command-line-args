'use strict';

var TestRunner = require('test-runner');
var cliArgs = require('../../');
var a = require('core-assert');

var runner = new TestRunner();

runner.test('getOpt short notation: two flags, one option', function () {
  var optionDefinitions = [{ name: 'flagA', alias: 'a' }, { name: 'flagB', alias: 'b' }, { name: 'three', alias: 'c' }];

  var argv = ['-abc', 'yeah'];
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    flagA: true,
    flagB: true,
    three: 'yeah'
  });
});

runner.test('option=value notation: two plus a regular notation', function () {
  var optionDefinitions = [{ name: 'one' }, { name: 'two' }, { name: 'three' }];

  var argv = ['--one=1', '--two', '2', '--three=3'];
  var result = cliArgs(optionDefinitions, argv);
  a.strictEqual(result.one, '1');
  a.strictEqual(result.two, '2');
  a.strictEqual(result.three, '3');
});

runner.test('option=value notation: value contains "="', function () {
  var optionDefinitions = [{ name: 'url' }, { name: 'two' }, { name: 'three' }];

  var result = cliArgs(optionDefinitions, ['--url=my-url?q=123', '--two', '2', '--three=3']);
  a.strictEqual(result.url, 'my-url?q=123');
  a.strictEqual(result.two, '2');
  a.strictEqual(result.three, '3');

  result = cliArgs(optionDefinitions, ['--url=my-url?q=123=1']);
  a.strictEqual(result.url, 'my-url?q=123=1');

  result = cliArgs({ name: 'my-url' }, ['--my-url=my-url?q=123=1']);
  a.strictEqual(result['my-url'], 'my-url?q=123=1');
});