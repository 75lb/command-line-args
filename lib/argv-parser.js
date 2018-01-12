'use strict'
/**
 * @module argv-parser
 */

class ArgvParser {
  /**
   * @param {OptionDefinitions} - Definitions array
   * @param {object} [options] - Options
   * @param {string[]} [options.argv] - Overrides `process.argv`
   * @param {boolean} [options.stopAtFirstUnknown] -
   */
  constructor (definitions, options) {
    this.options = options || {}
    const Definitions = require('./definitions')
    /**
     * Option Definitions
     */
    this.definitions = Definitions.from(definitions)

    const Argv = require('./argv-array')
    /**
     * Argv
     */
    this.argv = Argv.from(this.options.argv)
    this.argv.expandGetoptNotation()
  }

  processArg (argInfo) {
    return argInfo
  }

  /**
   * Yields one `{ event, name, value, arg, def }` pair for each arg in `process.argv` or the `options.argv`.
   */
  * [Symbol.iterator] () {
    const optionUtil = require('./option-util')
    const Definition = require('./definition')
    const definitions = this.definitions

    let def
    let value
    let name
    let event
    let singularDefaultSet = false
    let unknownFound = false

    /*
    Possible types of arg:
      * option(s)
        * --option [long option]
        * -o [short option]
        * -abc
      * value
      * --option=value [option equals value]
      * terminator (--)
    */
    for (let arg of this.argv) {
      if (unknownFound && this.options.stopAtFirstUnknown) {
        yield { event: 'unknown_value', arg, name: '_unknown', value: undefined }
        continue
      }

      /* handle long or short option */
      if (optionUtil.isOption(arg)) {
        def = definitions.get(arg)
        value = undefined
        if (def) {
          value = def.isBoolean() ? true : null
          event = 'set'
        } else {
          event = 'unknown_option'
        }

      /* handle --option-value notation */
      } else if (optionUtil.isOptionEqualsNotation(arg)) {
        const matches = arg.match(optionUtil.optEquals)
        def = definitions.get(matches[1])
        if (def) {
          if (def.isBoolean()) {
            yield { event: 'unknown_value', arg, name: '_unknown', value, def }
            event = 'set'
            value = true
          } else {
            event = 'set'
            value = matches[2]
          }
        } else {
          event = 'unknown_option'
        }

      /* handle value */
      } else if (optionUtil.isValue(arg)) {
        if (def) {
          value = arg
          event = 'set'
        } else {
          /* get the defaultOption */
          def = this.definitions.getDefault()
          if (def && !singularDefaultSet) {
            value = arg
            event = 'set'
          } else {
            event = 'unknown_value'
            def = undefined
          }
        }
      }


      name = def ? def.name : '_unknown'
      yield { event, arg, name, value, def }

      /* unknownFound logic */
      if (name === '_unknown') unknownFound = true

      /* singularDefaultSet logic */
      if (def && def.defaultOption && !def.isMultiple() && event === 'set') singularDefaultSet = true

      /* reset values once consumed and yielded */
      const t = require('typical')
      if (def && def.isBoolean()) def = undefined
      /* reset the def if it's a singular which has been set */
      if (def && !def.multiple && t.isDefined(value) && value !== null) {
        def = undefined
      }
      value = undefined
      event = undefined
      name = undefined
    }
  }
}

module.exports = ArgvParser
