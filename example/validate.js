var cliArgs = require('../')
var testValue = require('test-value')
var fs = require('fs')

var cli = cliArgs([
  { name: 'help', type: Boolean },
  { name: 'files', type: String, multiple: true, defaultOption: true },
  { name: 'log-level', type: String }
])

var options = cli.parse()

var usageForm = {}

usageForm.main = {
  files: function (files) {
    return files && files.every(fs.existsSync)
  },
  'log-level': [ 'info', 'warn', 'error', undefined ]
}

usageForm.help = {
  help: true
}

var valid = testValue(options, [ usageForm.main, usageForm.help ])

if (!valid) {
  // exit here
}

console.log(valid, options)
