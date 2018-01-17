'use strict'

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

exports.camelCaseObject = camelCaseObject
