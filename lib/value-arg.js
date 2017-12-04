class ValueArg {
  constructor (value) {
    const optionUtil = require('./option-util')
    const reBeginsWithValueMarker = new RegExp('^' + optionUtil.VALUE_MARKER)
    this.isOptionValueNotationValue = reBeginsWithValueMarker.test(value)
    /* if the value marker is present at the value beginning, strip it */
    this.value = value ? value.replace(reBeginsWithValueMarker, '') : value
  }

  isDefined () {
    const t = require('typical')
    return t.isDefined(this.value)
  }
}

module.exports = ValueArg
