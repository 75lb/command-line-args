'use strict'
const Option = require('./option')

class FlagOption extends Option {
  set (val) {
    super.set(true)
  }

  static create (def) {
    return new this(def)
  }
}

module.exports = FlagOption
