var test = require('tape')
var cliArgs = require('../')

var optionDefinitions = [
  { name: 'flagA', alias: 'a' },
  { name: 'flagB', alias: 'b' },
  { name: 'three', alias: 'c' }
]

test('getOpts: two flags, one option', function (t) {
  var argv = [ '-abc', 'yeah' ]
  t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
    flagA: true,
    flagB: true,
    three: 'yeah'
  })
  t.end()
})

test('getOpts: non-existent options', function (t) {
  var argv = [ '-sdf' ]
  t.throws(function () {
    cliArgs(optionDefinitions).parse(argv)
  }, /invalid/i)
  t.end()
})
