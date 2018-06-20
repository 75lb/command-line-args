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
  }

  /**
   * Yields one `{ event, name, value, arg, def }` argInfo object for each arg in `process.argv` (or `options.argv`).
   */
  * [Symbol.iterator] () {
    let singularDefaultSet = false
    let doubleDash = false

    let argv = this.argv.slice()
    while (argv.length > 0) {
      const arg = argv.shift()
      
      /* handle a long or single short option */
      if (!doubleDash && argvTools.isOption(arg)) {
        let def = this.definitions.get(arg)
        if (!def) {
          yield { event: 'unknown_option', arg: arg, name: '_unknown', value: undefined }
          if (this.stopAtFirstUnknown) { return }
          continue
        }
        
        if (def.isBoolean()) {
          yield { event: 'set', arg: arg, name: def.name, value: true, def: def }
          continue
        }
        
        // we need to look at the next argument. does it look like an option?
        const value = argv.shift() || null  // FIXME: error if none left?
        if (value && value.charAt(0) === '-') {
          // uh oh, looks like the value is missing
          argv.unshift(value)
          yield { event: 'set', arg: arg, name: def.name, value: null, def: def }
          continue
        }
        
        yield { event: 'set', arg: arg, name: def.name, value: value, def: def }
        continue
      }
      
      /* handle --option=value */
      else if (!doubleDash && argvTools.isOptionEqualsNotation(arg)) {
        const matches = arg.match(argvTools.re.optEquals)
        const option = matches[1]
        const value = matches[2]
        
        let def = this.definitions.get(option)
        if (!def) {
          yield { event: 'unknown_option', arg: option, name: '_unknown', value: value }
          if (this.stopAtFirstUnknown) { return }
          continue
        }
        
        yield { event: 'set', arg: arg, name: def.name, value: value, def: def }
        continue
      }
      
      /* handle grouped short options -abc */
      else if (!doubleDash && argvTools.re.combinedShort.test(arg)) {
        for (var i = 1; i < arg.length; i++) {
          let flag = arg.charAt(i)
          
          let def = this.definitions.get('-' + flag)
          if (!def) {
            yield { event: 'unknown_option', arg: flag, name: '_unknown', value: undefined }
            if (this.stopAtFirstUnknown) { return }
            continue
          }
          
          // booleans don't take arguments. on to the next one.
          if (def.isBoolean()) {
            yield { event: 'set', arg: flag, name: def.name, value: true, def: def }
            continue
          }
            
          // is the value attached like `-Xfoo` or unattached like `-X foo`?
          let value
          if (i < arg.length - 1) {  // it's attached
            value = arg.slice(i + 1)
          } else {
            value = (argv.shift() || null)  // FIXME: error if none left?
            
            // does it look like the value was meant to be an option?
            if (value && value.charAt(0) === '-') {
              // uh oh, looks like the value is missing
              argv.unshift(value)
              value = null
            }
          }
          
          yield { event: 'set', arg: flag, name: def.name, value: value, def: def }
          break  // to consume the rest of the argument
        }
      }
      
      /* detect the double dash */
      else if (arg === '--') {
        doubleDash = true
        continue
      }
      
      /* handle default options */
      else {
        let def = this.definitions.getDefault()
        if (!def) {
          yield { event: 'unknown_value', arg, name: '_unknown', value: undefined }
          continue
        }
        
        // We were not expecting multiple default options
        if (!def.isMultiple() && singularDefaultSet) {
          yield { event: 'unknown_value', arg, name: '_unknown', value: undefined }
          continue
        }
        
        yield { event: 'set', arg, name: def.name, value: arg, def: def }
        singularDefaultSet = true
        continue
      }
    }
  }
}

module.exports = ArgvParser
