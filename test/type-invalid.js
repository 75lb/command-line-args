var test = require('tape')
var cliArgs = require('../')

test('type-invalid: invalid type values', function (t) {
  var argv = [ '--one', 'something' ]
  t.throws(function () {
    cliArgs([ { name: 'one', type: 'string' } ]).parse(argv)
  }, /invalid/i)

  t.throws(function () {
    cliArgs([ { name: 'one', type: 234 } ]).parse(argv)
  }, /invalid/i)

  t.throws(function () {
    cliArgs([ { name: 'one', type: {} } ]).parse(argv)
  }, /invalid/i)

  t.doesNotThrow(function () {
    cliArgs([ { name: 'one', type: function () {} } ]).parse(argv)
  }, /invalid/i)

  t.end()
})
