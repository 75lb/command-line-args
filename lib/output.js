'use strict'
const t = require('typical')
const arrayify = require('array-back')

class Output {
  constructor (defs, options) {
    this.options = options || {}
    this.output = {}
    this.hasDefaultArrayValue = {}
    this.unknown = []
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
    /* if the value marker is present at the beginning, strip it */
    const option = require('./option')
    const reBeginsWithValueMarker = new RegExp('^' + option.VALUE_MARKER)
    const isOptionValueNotationValue = reBeginsWithValueMarker.test(value)
    value = isOptionValueNotationValue
      ? value.replace(reBeginsWithValueMarker, '')
      : value

    /* lookup the definition.. if no optionArg (--option) was supplied, use the defaultOption */
    let def
    if (t.isDefined(optionArg)) {
      def = this.definitions.get(optionArg)
    } else {
      def = this.definitions.getDefault()
      if (def) {
        /* if it's not a `multiple` and the defaultOption has already been set, move on */
        if (!def.multiple && t.isDefined(this.output[def.name]) && this.output[def.name] !== def.defaultValue) {
          if (t.isDefined(value)) this.unknown.push(value)
          return true
        /* in the case we're setting an --option=value value on a multiple defaultOption, tag the value onto the previous unknown */
        } else if (def.multiple && isOptionValueNotationValue && t.isDefined(this.output[def.name])) {
          if (t.isDefined(value) && this.unknown.length) {
            this.unknown[this.unknown.length - 1] += `=${value}`
            return true
          }
        }
      }
    }

    /* if there's no definition or defaultOption, do nothing and continue */
    if (!def) {
      if (t.isDefined(optionArg)) this.unknown.push(optionArg)
      if (t.isDefined(value)) {
        if (isOptionValueNotationValue) {
          this.unknown[this.unknown.length - 1] += `=${value}`
        } else {
          this.unknown.push(value)
        }
      }
      return true
    }

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
    let output
    if (this.options.partial && this.unknown.length) {
      output = Object.assign({}, this.output)
      output._unknown = this.unknown
    } else {
      output = this.output
    }
    return output
  }
}

module.exports = Output
