'use strict'
const t = require('typical')
const arrayify = require('array-back')

class Output {
  constructor (defs) {
    this.output = {}
    this.hasDefaultArrayValue = {}
    const Definitions = require('./definitions')
    this.definitions = new Definitions()
    this.definitions.load(defs)
    this._assignDefaultValues()
  }

  _assignDefaultValues () {
    this.definitions.forEach(def => {
      if (t.isDefined(def.defaultValue)) {
        this.output[def.name] = def.multiple ? arrayify(def.defaultValue) : def.defaultValue
        if (def.multiple) {
          this.hasDefaultArrayValue[def.name] = true
        }
      }
    })
  }

  /**
   * Return `true` when an option value was set and is not a multiple. Return `false` if option was a multiple or if a value was not yet set.
   */
  set (optionArg, value) {
    // console.log(option, value)

    /* if the value marker is present at the beginning, strip it */
    const option = require('./option')
    const reBeginsWithValueMarker = new RegExp('^' + option.VALUE_MARKER)
    value = reBeginsWithValueMarker.test(value)
      ? value.replace(reBeginsWithValueMarker, '')
      : value

    /* lookup the definition.. if no optionArg (--option) was supplied, use the defaultOption */
    const def = t.isDefined(optionArg) ? this.definitions.get(optionArg) : this.definitions.getDefault()

    /* if there's no definition or defaultOption, do nothing and continue */
    if (!def) return false

    const name = def.name

    /* if not already initialised, set a `multiple` value to a new array.  */
    if (def.multiple && !t.isDefined(this.output[name])) this.output[name] = []

    /* for boolean types, set value to `true`. For all other types run value through setter function. */
    if (def.isBoolean()) {
      value = true
    } else if (t.isDefined(value)) {
      value = def.type ? def.type(value) : value
    }

    if (t.isDefined(value)) {
      if (Array.isArray(this.output[name])) {
        if (this.hasDefaultArrayValue[name]) {
          this.output[name] = [ value ]
          delete this.hasDefaultArrayValue[name]
        } else {
          this.output[name].push(value)
        }
        return false
      } else {
        this.output[name] = value
        return true
      }
    } else {
      if (!Array.isArray(this.output[name])) this.output[name] = null
      return false
    }
  }

  get (name) {
    return this.output[name]
  }

  toObject () {
    return this.output
  }
}

module.exports = Output
