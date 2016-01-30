var test = require('tape')
var cliArgs = require('../')
var Argv = require('../lib/argv')

test('.expandOptionEqualsNotation()', function (t) {
  var argv = new Argv([ '--one=1', '--two', '2', '--three=3', '4' ])
  argv.expandOptionEqualsNotation()
  t.deepEqual(argv, [
    '--one', '1', '--two', '2', '--three', '3', '4'
  ])
  t.end()
})

test('.expandGetoptNotation()', function (t) {
  var argv = new Argv([ '-abc' ])
  argv.expandGetoptNotation()
  t.deepEqual(argv, [
    '-a', '-b', '-c'
  ])
  t.end()
})

test('.expandGetoptNotation() with values', function (t) {
  var argv = new Argv([ '-abc', '1', '-a', '2', '-bc' ])
  argv.expandGetoptNotation()
  t.deepEqual(argv, [
    '-a', '-b', '-c', '1', '-a', '2', '-b', '-c'
  ])
  t.end()
})
