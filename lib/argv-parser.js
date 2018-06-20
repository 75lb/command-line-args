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
   * Shifts one value off the argument list and returns it. If the next
   * argument looks like an option, then it does not shift the value and returns
   * null instead. If there is no value to shift, then it also returns null.
   */
  _shiftOneValue(argv) {
    const value = argv.shift() || null
    if (value && !argvTools.isValue(value)) {
      // uh oh, looks like the value is missing
      argv.unshift(value)
      return null
    }
    return value
  }
  
  /**
   * Shifts multiple values off the argument list, returning an array. It stops
   * at the first argument that looks like an option.
   */
  _shiftValues(argv, nargs='*') {
    // TODO: Implement the `narg` parameter to behave like Python's argparse
    let values = []
    while (argv.length > 0) {
      const value = argv.shift() || null
      if (value === null) { break }
      if (!argvTools.isValue(value)) {
        // we reached the end
        argv.unshift(value)
        break
      }
      values.push(value)
    }
    return values
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
          if (this.options.stopAtFirstUnknown) { return }
          continue
        }
        
        if (def.isBoolean()) {
          yield { event: 'set', arg: arg, name: def.name, value: true, def: def }
          continue
        }
        
        // get the value from the next argument
        const value = def.multiple ? this._shiftValues(argv) : this._shiftOneValue(argv)
        yield { event: 'set', arg: arg, name: def.name, value: value, def: def }
        continue
      }
      
      /* handle --option=value */
      else if (!doubleDash && argvTools.isOptionEqualsNotation(arg)) {
        const matches = arg.match(argvTools.re.optEquals)
        const option = matches[1]
        let value = matches[2]
        
        let def = this.definitions.get(option)
        if (!def) {
          yield { event: 'unknown_option', arg: arg, name: '_unknown', value: undefined }
          if (this.options.stopAtFirstUnknown) { return }
          continue
        }
        
        // For a boolean, it's not expected that you would assign a value, but
        // we won't make it a hard failure
        if (def.isBoolean()) {
          yield { event: 'unknown_value', arg: arg, name: '_unknown', value: undefined, def: def }
          value = true
        }
        
        // If it can take multiple values, accumulate them
        if (def.multiple) {
          value = [ value ].concat(this._shiftValues(argv))
        }
        
        yield { event: 'set', arg: arg, name: def.name, value: value, def: def }
        continue
      }
      
      /* handle grouped short options -abc */
      else if (!doubleDash && argvTools.re.combinedShort.test(arg)) {
        for (var i = 1; i < arg.length; i++) {
          let flag = '-' + arg.charAt(i)
          
          let def = this.definitions.get(flag)
          if (!def) {
            yield { event: 'unknown_option', arg: arg, subArg: flag, name: '_unknown', value: undefined }
            if (this.options.stopAtFirstUnknown) { return }
            continue
          }
          
          // booleans don't take arguments. on to the next one.
          if (def.isBoolean()) {
            yield { event: 'set', arg: arg, subArg: flag, name: def.name, value: true, def: def }
            continue
          }
            
          // is the value attached like `-Xfoo` or unattached like `-X foo`?
          let value
          if (i < arg.length - 1) {  // it's attached
            value = arg.slice(i + 1)
          } else {
            value = def.multiple ? this._shiftValues(argv) : this._shiftOneValue(argv)
          }
          
          yield { event: 'set', arg: arg, subArg: flag, name: def.name, value: value, def: def }
          break  // to consume the rest of the argument
        }
      }
      
      /* handle the double dash separator -- disabled for now */
      /*
      else if (arg === '--') {
        doubleDash = true
        continue
      }
      */
      
      /* handle default options */
      else {
        let def = this.definitions.getDefault()
        if (!def) {
          yield { event: 'unknown_value', arg, name: '_unknown', value: undefined }
          if (this.options.stopAtFirstUnknown) { return }
          continue
        }
        
        // We were not expecting multiple default options
        if (!def.isMultiple() && singularDefaultSet) {
          yield { event: 'unknown_value', arg, name: '_unknown', value: undefined }
          if (this.options.stopAtFirstUnknown) { return }
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
