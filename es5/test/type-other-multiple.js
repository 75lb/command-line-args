'use strict';

var TestRunner = require('test-runner');
var cliArgs = require('../../');
var a = require('core-assert');

var optionDefinitions = [{ name: 'file', multiple: true, type: function type(file) {
    return file;
  } }];

var runner = new TestRunner();

runner.test('type-other-multiple: different values', function () {
  a.deepStrictEqual(cliArgs(optionDefinitions, ['--file', 'one.js']), { file: ['one.js'] });
  a.deepStrictEqual(cliArgs(optionDefinitions, ['--file', 'one.js', 'two.js']), { file: ['one.js', 'two.js'] });
  a.deepStrictEqual(cliArgs(optionDefinitions, ['--file']), { file: [] });
});