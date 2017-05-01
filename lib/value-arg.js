'use strict'
const t = require('typical')
const option = require('./option')
const reBeginsWithValueMarker = new RegExp('^' + option.VALUE_MARKER)

class ValueArg {
  constructor (value) {
    this.initialValue = value
    this.value = this.stripMarker(value)
  }

  isOptionValueNotationValue () {
    return reBeginsWithValueMarker.test(this.initialValue)
  }

  /**
   * if the value marker is present at the beginning, strip it
   */
  stripMarker (value) {    
    return this.isOptionValueNotationValue()
      ? value.replace(reBeginsWithValueMarker, '')
      : value
  }

  isDefined () {
    return t.isDefined(this.value)
  }
}

module.exports = ValueArg
