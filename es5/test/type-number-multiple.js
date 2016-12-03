'use strict';

var TestRunner = require('test-runner');
var cliArgs = require('../../');
var a = require('core-assert');

var optionDefinitions = [{ name: 'array', type: Number, multiple: true }];

var runner = new TestRunner();

runner.test('number multiple: 1', function () {
  var argv = ['--array', '1', '2', '3'];
  var result = cliArgs(optionDefinitions, argv);
  a.deepStrictEqual(result, {
    array: [1, 2, 3]
  });
  a.notDeepStrictEqual(result, {
    array: ['1', '2', '3']
  });
});

runner.test('number multiple: 2', function () {
  var argv = ['--array', '1', '--array', '2', '--array', '3'];
  var result = cliArgs(optionDefinitions, argv);
  a.deepStrictEqual(result, {
    array: [1, 2, 3]
  });
  a.notDeepStrictEqual(result, {
    array: ['1', '2', '3']
  });
});