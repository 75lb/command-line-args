'use strict';

var TestRunner = require('test-runner');
var cliArgs = require('../../');
var a = require('core-assert');

var runner = new TestRunner();

runner.test('type-other: different values', function () {
  var optionDefinitions = [{ name: 'file', type: function type(file) {
      return file;
    } }];

  a.deepStrictEqual(cliArgs(optionDefinitions, ['--file', 'one.js']), { file: 'one.js' });
  a.deepStrictEqual(cliArgs(optionDefinitions, ['--file']), { file: null });
});

runner.test('type-other: broken custom type function', function () {
  var optionDefinitions = [{ name: 'file', type: function type(file) {
      lasdfjsfakn;
    } }];
  a.throws(function () {
    cliArgs(optionDefinitions, ['--file', 'one.js']);
  });
});