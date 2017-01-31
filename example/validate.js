/*
  command-line-args parses the command line but does not validate what was collected.
  This is an example of how values collected can be validated.
*/

'use strict'
const commandLineArgs = require('../')
const fs = require('fs')

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'files', type: String, multiple: true, defaultOption: true },
  { name: 'log-level', type: String }
]

const options = commandLineArgs(optionDefinitions)

const valid =
  options.help ||
  (
    /* all supplied files should exist and --log-level should be one from the list */
    options.files &&
    options.files.length &&
    options.files.every(fs.existsSync) &&
    [ 'info', 'warn', 'error', undefined ].includes(options['log-level'])
  )

console.log('your options are', valid ? 'valid' : 'invalid', options)
