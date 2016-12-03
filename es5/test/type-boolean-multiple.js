'use strict';

var TestRunner = require('test-runner');
var cliArgs = require('../../');
var a = require('core-assert');

var runner = new TestRunner();

var optionDefinitions = [{ name: 'array', type: Boolean, multiple: true }];

runner.test('type-boolean-multiple: 1', function () {
  var argv = ['--array', '--array', '--array'];
  var result = cliArgs(optionDefinitions, argv);
  a.deepStrictEqual(result, {
    array: [true, true, true]
  });
});