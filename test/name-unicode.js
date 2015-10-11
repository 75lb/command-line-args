var test = require('tape')
var cliArgs = require('../')

var optionDefinitions = [
  { name: 'один' },
  { name: 'два' },
  { name: 'три', alias: 'т' }
]

test('name-unicode: unicode names and aliases are permitted', function (t) {
  var argv = [ '--один', '1', '--два', '2', '-т', '3' ]
  var cli = cliArgs(optionDefinitions)
  var result = cli.parse(argv)
  t.strictEqual(result.один, '1')
  t.strictEqual(result.два, '2')
  t.strictEqual(result.три, '3')
  t.end()
})
