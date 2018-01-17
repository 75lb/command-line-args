'use strict'
const Output = require('./output')

class GroupedOutput extends Output {
  toObject (options) {
    const arrayify = require('array-back')
    const t = require('typical')
    const superOutput = super.toObject(options)
    const unknown = superOutput._unknown
    delete superOutput._unknown
    const grouped = {
      _all: superOutput
    }
    if (unknown && unknown.length) grouped._unknown = unknown

    this.definitions.whereGrouped().forEach(def => {
      const outputValue = superOutput[def.name]
      for (const groupName of arrayify(def.group)) {
        grouped[groupName] = grouped[groupName] || {}
        if (t.isDefined(outputValue)) {
          grouped[groupName][def.name] = outputValue
        }
      }
    })

    this.definitions.whereNotGrouped().forEach(def => {
      const outputValue = superOutput[def.name]
      if (t.isDefined(outputValue)) {
        if (!grouped._none) grouped._none = {}
        grouped._none[def.name] = outputValue
      }
    })
    return grouped
  }
}

module.exports = GroupedOutput
