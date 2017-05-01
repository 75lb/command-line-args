'use strict'
const t = require('typical')
const arrayify = require('array-back')
const Output = require('./output')

class GroupedOutput extends Output {
  toObject () {
    const superOutput = super.toObject()
    delete superOutput._unknown
    const grouped = {
      _all: superOutput
    }
    if (this.unknown.length) grouped._unknown = this.unknown

    this.definitions.whereGrouped().forEach(def => {
      arrayify(def.group).forEach(groupName => {
        grouped[groupName] = grouped[groupName] || {}
        if (t.isDefined(this.output[def.name].value)) {
          grouped[groupName][def.name] = this.output[def.name].value
        }
      })
    })

    this.definitions.whereNotGrouped().forEach(def => {
      if (t.isDefined(this.output[def.name].value)) {
        if (!grouped._none) grouped._none = {}
        grouped._none[def.name] = this.output[def.name].value
      }
    })
    return grouped
  }
}

module.exports = GroupedOutput
