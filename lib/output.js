'use strict'
const Option = require('./option')
const t = require('typical')

class Output extends Map {
  constructor (definitions) {
    super()
    this.set('_unknown', Option.create({ name: '_unknown', multiple: true }))
    const Definitions = require('./definitions')
    this.definitions = Definitions.from(definitions)
    for (const def of this.definitions.filter(def => t.isDefined(def.defaultValue))) {
      this.set(def.name, Option.create(def))
    }
  }

  toObject (options) {
    options = options || {}
    const output = {}
    for (const item of this) {
      const name = item[0]
      const option = item[1]
      if (name === '_unknown' && !option.get().length) continue
      output[name] = option.get()
    }

    if (options.skipUnknown) delete output._unknown
    return output
  }
}

module.exports = Output
