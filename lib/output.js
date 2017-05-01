'use strict'
const t = require('typical')
const arrayify = require('array-back')

class OutputValue {
  constructor (value) {
    this.value = value
    this.hasDefaultArrayValue = false
    this.isDefaultValue = false
    this.isSuppliedValue = false
    this.valueSource = 'unknown'
  }
}

class Output {
  constructor (definitions, options) {
    this.options = options || {}
    this.output = {}
    this.unknown = []
    this.definitions = definitions
    this._assignDefaultValues()
  }

  _assignDefaultValues () {
    this.definitions.forEach(def => {
      if (t.isDefined(def.defaultValue)) {
        if (def.multiple) {
          this.output[def.name] = new OutputValue(arrayify(def.defaultValue))
          this.output[def.name].hasDefaultArrayValue = true
        } else {
          this.output[def.name] = new OutputValue(def.defaultValue)
        }
        this.output[def.name].valueSource = 'default'
      }
    })
  }

  /**
   * Return `true` when an option value was set and is not a multiple. Return `false` if option was a multiple or if a value was not yet set.
   */
  set (optionArg, value) {
    /* if the value marker is present at the beginning, strip it */
    const option = require('./option')
    const ValueArg = require('./value-arg')
    const valueArg = new ValueArg(value)

    /* lookup the definition.. if no optionArg (--option) was supplied, use the defaultOption */
    let def
    if (t.isDefined(optionArg)) {
      def = this.definitions.get(optionArg)
    } else {
      def = this.definitions.getDefault()
      const currentValue = this.output[def && def.name] && this.output[def && def.name]

      /* check for and handle unknown values */
      if (def && currentValue && t.isDefined(currentValue.value)) {
        if (def.multiple) {
          /* in the case we're setting an --option=value value on a multiple defaultOption, tag the value onto the previous unknown */
          if (valueArg.isOptionValueNotationValue() && valueArg.isDefined() && this.unknown.length) {
            this.unknown[this.unknown.length - 1] += `=${valueArg.value}`
            return true
          }
        } else {
          /* currentValue has already been set by argv,log this value as unknown and move on */
          if (currentValue.valueSource === 'argv') {
            if (valueArg.isDefined()) this.unknown.push(valueArg.value)
            return true
          }
        }
      }
    }

    /* if there's no definition or defaultOption, do nothing and continue */
    if (!def) {
      if (t.isDefined(optionArg)) this.unknown.push(optionArg)
      if (valueArg.isDefined()) {
        if (valueArg.isOptionValueNotationValue()) {
          this.unknown[this.unknown.length - 1] += `=${valueArg.value}`
        } else {
          this.unknown.push(valueArg.value)
        }
      }
      return true
    }

    const name = def.name
    this.output[name] = this.output[name] || new OutputValue()
    const outputValue = this.output[name]

    /* if not already initialised, set a `multiple` value to a new array.  */
    if (def.multiple && !t.isDefined(outputValue.value)) outputValue.value = []

    /* for boolean types, set value to `true`. For all other types run value through setter function. */
    if (def.isBoolean()) {
      valueArg.value = true
    } else if (valueArg.isDefined()) {
      valueArg.value = def.type ? def.type(valueArg.value) : valueArg.value
    }

    /* set output value */
    if (valueArg.isDefined()) {
      outputValue.valueSource = 'argv'
      if (Array.isArray(outputValue.value)) {
        if (outputValue.hasDefaultArrayValue) {
          outputValue.value = [ valueArg.value ]
          outputValue.hasDefaultArrayValue = false
        } else {
          outputValue.value.push(valueArg.value)
        }
        return false
      } else {
        outputValue.value = valueArg.value
        return true
      }
    } else {
      if (!Array.isArray(outputValue.value) && outputValue.valueSource === 'unknown') outputValue.value = null
      return false
    }
  }

  get (name) {
    return this.output[name] && this.output[name].value
  }

  toObject () {
    let output = Object.assign({}, this.output)
    if (this.options.partial && this.unknown.length) {
      output._unknown = this.unknown
    }
    for (const prop in output) {
      if (prop !== '_unknown') {
        output[prop] = output[prop].value
      }
    }
    return output
  }
}

module.exports = Output
