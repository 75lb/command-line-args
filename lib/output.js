'use strict'
const Option = require('./option')

class Output extends Map {
  constructor (definitions) {
    super()
    const Definitions = require('./definitions')
    this.definitions = Definitions.from(definitions)
    /* by default, an Output has an _unknown and any options with defaultValues */
    this.set('_unknown', Option.create({ name: '_unknown', multiple: true }))
    for (const def of this.definitions.whereDefaultValueSet()) {
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
