'use strict'
const commandLineArgs = require('../')

const optionDefinitions = [
  { name: 'help', type: Boolean },
  { name: 'files', alias: 'f', type: String, multiple: true, defaultOption: true }
]

const options = commandLineArgs(optionDefinitions, { partial: true })

console.log(options)
