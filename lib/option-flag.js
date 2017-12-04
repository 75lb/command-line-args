'use strict'
const Option = require('./option')

class FlagOption extends Option {
  set (val) {
    if (this.definition.isBoolean()) val = true
    super.set(val)
  }

  static create (def) {
    return new this(def)
  }
}

module.exports = FlagOption
