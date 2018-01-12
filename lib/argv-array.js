'use strict'
const optionUtil = require('./option-util')

/**
 * Handles parsing different argv notations
 *
 * @module argv-array
 */

class ArgvArray extends Array {
  load (argv) {
    const arrayify = require('array-back')
    this.clear()
    if (argv) {
      argv = arrayify(argv)
    } else {
      /* if no argv supplied, assume we are parsing process.argv */
      argv = process.argv.slice(0)
      argv.splice(0, 2)
    }
    argv.forEach(arg => this.push(String(arg)))
  }

  clear () {
    this.length = 0
  }

  /**
   * expand --option=value style args. The value is clearly marked to indicate it is definitely a value (which would otherwise be unclear if the value is `--value`, which would be parsed as an option). The special marker is removed in parsing phase.
   */
  expandOptionEqualsNotation () {
    const optEquals = optionUtil.optEquals
    if (this.some(arg => optEquals.test(arg))) {
      const expandedArgs = []
      this.forEach(arg => {
        const matches = arg.match(optEquals)
        if (matches) {
          expandedArgs.push(matches[1], optionUtil.VALUE_MARKER + matches[2])
        } else {
          expandedArgs.push(arg)
        }
      })
      this.clear()
      this.load(expandedArgs)
    }
  }

  /**
   * expand getopt-style combined options
   */
  expandGetoptNotation () {
    const findReplace = require('find-replace')
    const combinedArg = optionUtil.combined
    const hasGetopt = this.some(arg => combinedArg.test(arg))
    if (hasGetopt) {
      findReplace(this, combinedArg, arg => {
        arg = arg.slice(1)
        return arg.split('').map(letter => '-' + letter)
      })
    }
  }

  static from (argv) {
    const result = new this()
    result.load(argv)
    return result
  }
}

module.exports = ArgvArray
