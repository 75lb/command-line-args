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
exports.combined = /^-[^\d-]{2,}$/
exports.isOption = arg => (exports.short.test(arg) || exports.long.test(arg)) && !exports.optEquals.test(arg)
exports.optEquals = new OptEqualsRegExp('^(--\\S+?)=(.*)')
exports.isOptionEqualsNotation = arg => exports.optEquals.test(arg)
exports.isValue = arg => !(exports.isOption() || exports.combined.test(arg) || exports.optEquals.test(arg))
exports.VALUE_MARKER = 'EXPLICIT-VALUE-MARKER-656a659e9efb-' // must be unique
exports.camelCaseObject = camelCaseObject
