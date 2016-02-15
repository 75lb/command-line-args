var test = require('tape')
var cliArgs = require('../')

var optionDefinitions = [
  { name: 'one', type: Boolean, description: 'first option' }
]

test('usage: simple', function (t) {
  var cli = cliArgs(optionDefinitions)
  var usage = cli.getUsage({ title: 'test' })
  t.ok(/test/.test(usage), 'title present')
  t.ok(/first option/.test(usage), 'description present')
  t.end()
})
