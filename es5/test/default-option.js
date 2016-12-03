'use strict';

var TestRunner = require('test-runner');
var cliArgs = require('../../');
var a = require('core-assert');

var runner = new TestRunner();

runner.test('defaultOption: string', function () {
  var optionDefinitions = [{ name: 'files', defaultOption: true }];
  var argv = ['file1', 'file2'];
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    files: 'file2'
  });
});

runner.test('defaultOption: multiple string', function () {
  var optionDefinitions = [{ name: 'files', defaultOption: true, multiple: true }];
  var argv = ['file1', 'file2'];
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    files: ['file1', 'file2']
  });
});

runner.test('defaultOption: after a boolean', function () {
  var definitions = [{ name: 'one', type: Boolean }, { name: 'two', defaultOption: true }];
  a.deepStrictEqual(cliArgs(definitions, ['--one', 'sfsgf']), { one: true, two: 'sfsgf' });
});

runner.test('defaultOption: multiple defaultOption values between other arg/value pairs', function () {
  var optionDefinitions = [{ name: 'one' }, { name: 'two' }, { name: 'files', defaultOption: true, multiple: true }];
  var argv = ['--one', '1', 'file1', 'file2', '--two', '2'];
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    one: '1',
    two: '2',
    files: ['file1', 'file2']
  });
});

runner.test('defaultOption: multiple defaultOption values between other arg/value pairs 2', function () {
  var optionDefinitions = [{ name: 'one', type: Boolean }, { name: 'two' }, { name: 'files', defaultOption: true, multiple: true }];
  var argv = ['file0', '--one', 'file1', '--files', 'file2', '--two', '2', 'file3'];
  a.deepStrictEqual(cliArgs(optionDefinitions, argv), {
    one: true,
    two: '2',
    files: ['file0', 'file1', 'file2', 'file3']
  });
});

runner.test('defaultOption: floating args present but no defaultOption', function () {
  var definitions = [{ name: 'one', type: Boolean }];
  a.deepStrictEqual(cliArgs(definitions, ['aaa', '--one', 'aaa', 'aaa']), { one: true });
});