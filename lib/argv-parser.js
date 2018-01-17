'use strict'
const argvTools = require('argv-tools')

/**
 * @module argv-parser
 */

/**
 * @alias module:argv-parser
 */
class ArgvParser {
  /**
   * @param {OptionDefinitions} - Definitions array
   * @param {object} [options] - Options
   * @param {string[]} [options.argv] - Overrides `process.argv`
   * @param {boolean} [options.stopAtFirstUnknown] -
   */
  constructor (definitions, options) {
    this.options = Object.assign({}, options)
    const Definitions = require('./option-definitions')
    /**
     * Option Definitions
     */
    this.definitions = Definitions.from(definitions)

    /**
     * Argv
     */
    this.argv = argvTools.ArgvArray.from(this.options.argv)
    if (this.argv.hasCombinedShortOptions()) {
      const findReplace = require('find-replace')
      findReplace(this.argv, argvTools.re.combinedShort, arg => {
        arg = arg.slice(1)
        return arg.split('').map(letter => ({ origArg: `-${arg}`, arg: '-' + letter }))
      })
    }
  }

  /**
   * Yields one `{ event, name, value, arg, def }` argInfo object for each arg in `process.argv` (or `options.argv`).
   */
  * [Symbol.iterator] () {
    const definitions = this.definitions
    const t = require('typical')

    let def
    let value
    let name
    let event
    let singularDefaultSet = false
    let unknownFound = false
    let origArg

    for (let arg of this.argv) {
      if (t.isPlainObject(arg)) {
        origArg = arg.origArg
        arg = arg.arg
      }

      if (unknownFound && this.options.stopAtFirstUnknown) {
        yield { event: 'unknown_value', arg, name: '_unknown', value: undefined }
        continue
      }

      /* handle long or short option */
      if (argvTools.isOption(arg)) {
        def = definitions.get(arg)
        value = undefined
        if (def) {
          value = def.isBoolean() ? true : null
          event = 'set'
        } else {
          event = 'unknown_option'
        }

      /* handle --option-value notation */
    } else if (argvTools.isOptionEqualsNotation(arg)) {
        const matches = arg.match(argvTools.re.optEquals)
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
    } else if (argvTools.isValue(arg)) {
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
      const argInfo = { event, arg, name, value, def }
      if (origArg) {
        argInfo.subArg = arg
        argInfo.arg = origArg
      }
      yield argInfo

      /* unknownFound logic */
      if (name === '_unknown') unknownFound = true

      /* singularDefaultSet logic */
      if (def && def.defaultOption && !def.isMultiple() && event === 'set') singularDefaultSet = true

      /* reset values once consumed and yielded */
      if (def && def.isBoolean()) def = undefined
      /* reset the def if it's a singular which has been set */
      if (def && !def.multiple && t.isDefined(value) && value !== null) {
        def = undefined
      }
      value = undefined
      event = undefined
      name = undefined
      origArg = undefined
    }
  }
}

module.exports = ArgvParser
