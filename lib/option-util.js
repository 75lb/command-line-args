'use strict'

class ArgRegExp extends RegExp {
  name (arg) {
    return arg.match(this)[1]
  }
}

class OptEqualsRegExp extends RegExp {
  name (arg) {
    return arg.match(this)[1]
  }
  value (arg) {
    return arg.match(this)[2]
  }
}

/**
 * Inspect the user-supplied options for validation issues.
 * @throws `UNKNOWN_OPTION`
 * @property {string} optionName - The first invalid option found by the parser.
 */
function validate (definitions, options, argvIn) {
  options = options || {}
  let optionName
  const ArgvArray = require('./argv-array')
  const argv = ArgvArray.from(argvIn)
  argv.expandOptionEqualsNotation()
  argv.expandGetoptNotation()

  if (!options.partial) {
    /* look for options in argv without a definition */
    const optionWithoutDefinition = argv
      .filter(arg => exports.isOption(arg))
      .some(arg => {
        if (definitions.get(arg) === undefined) {
          optionName = arg
          return true
        }
      })
    if (optionWithoutDefinition) {
      const err = new Error('Unknown option: ' + optionName)
      err.name = 'UNKNOWN_OPTION'
      err.optionName = optionName
      throw err
    }
  }
}

function camelCaseObject (object) {
  const camelCase = require('lodash.camelcase')
  for (const prop of Object.keys(object)) {
    const converted = camelCase(prop)
    if (converted !== prop) {
      object[converted] = object[prop]
      delete object[prop]
    }
  }
  return object
}

exports.short = new ArgRegExp('^-([^\\d-])$')
exports.long = new ArgRegExp('^--(\\S+)')
exports.combined = new RegExp('^-([^\\d-]{2,})$')
exports.isOption = arg => exports.short.test(arg) || exports.long.test(arg)
exports.optEquals = new OptEqualsRegExp('^(--\\S+?)=(.*)')
exports.VALUE_MARKER = 'EXPLICIT-VALUE-MARKER-656a659e9efb-' // must be unique
exports.validate = validate
exports.camelCaseObject = camelCaseObject
