'use strict'
const t = require('typical')
const arrayify = require('array-back')
const Output = require('./output')

class GroupedOutput extends Output {
  toObject () {
    const grouped = {
      _all: this.output
    }
    if (this.unknown.length) grouped._unknown = this.unknown

    this.definitions.whereGrouped().forEach(def => {
      arrayify(def.group).forEach(groupName => {
        grouped[groupName] = grouped[groupName] || {}
        if (t.isDefined(this.output[def.name])) {
          grouped[groupName][def.name] = this.output[def.name]
        }
      })
    })

    this.definitions.whereNotGrouped().forEach(def => {
      if (t.isDefined(this.output[def.name])) {
        if (!grouped._none) grouped._none = {}
        grouped._none[def.name] = this.output[def.name]
      }
    })
    return grouped
  }
}

module.exports = GroupedOutput
