import Option from './option.js'

class FlagOption extends Option {
  set (val) {
    super.set(true)
  }

  static create (def) {
    return new this(def)
  }
}

export default FlagOption
