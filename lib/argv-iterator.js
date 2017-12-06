'use strict'
/**
 * @module argv-iterator
 */

/**
 * Yields one `[ optionName, optionValue ]` pair for each command-line arg in `process.argv` or the `options.argv`.
 */
class ArgvIterator {
  /**
   * @param {OptionDefinitions} - Definitions array
   * @param {object} [options] - Options
   * @param {string[]} [options.argv] - Overrides `process.argv`
   * @param {boolean} [options.strictValues] - Throw on unaccounted for values.
   * @param {boolean} [options.greedy] - Set to false to disable greedy parsing.
   * @param {boolean} [options.stopParsingAtFirstUnknown] - Stop parsing at first unknown.
   */
  constructor (definitions, options) {
    options = options || {}
    const Definitions = require('./definitions')
    this.definitions = Definitions.from(definitions)
    this.strictValues = options.strictValues
    this.stopParsingAtFirstUnknown = options.stopParsingAtFirstUnknown
    const Argv = require('./argv-array')
    this.argv = Argv.from(options.argv)
    this.argv.expandGetoptNotation()
  }

  * [Symbol.iterator] () {
    const optionUtil = require('./option-util')
    const Definition = require('./definition')
    const definitions = this.definitions

    let currentDefinition
    let optionValue
    let unknownsFound = false

    for (let arg of this.argv) {
      if (this.stopParsingAtFirstUnknown && unknownsFound) {
        yield [ '_unknown', arg ]
        continue
      }

      /* determine option */
      if (optionUtil.optEquals.test(arg)) {
        currentDefinition = definitions.get(optionUtil.optEquals.name(arg))
      } else if (optionUtil.isOption(arg)) {
        currentDefinition = definitions.get(arg)
      } else {
        if (currentDefinition) {
          currentDefinition = ((currentDefinition.multiple && currentDefinition.greedy) || !optionValue) ? currentDefinition : undefined
        } else {
          currentDefinition = definitions.getDefault()
        }
      }

      if (!currentDefinition && optionUtil.isOption(arg)) {
        currentDefinition = Definition.create({ name: '_unknown' })
      } else {
        if (!currentDefinition) currentDefinition = definitions.getDefault() || Definition.create({ name: '_unknown' })
      }

      if (this.strictValues && currentDefinition.name === '_unknown') {
        const err = new Error('Unknown value: ' + arg)
        err.name = 'UNKNOWN_VALUE'
        err.value = arg
        throw err
      }

      /* determine value */
      if (optionUtil.optEquals.test(arg)) {
        optionValue = optionUtil.optEquals.value(arg)
      } else if (optionUtil.isOption(arg)) {
        optionValue = currentDefinition.name === '_unknown' ? arg : currentDefinition.isBoolean() ? true : null
      } else {
        optionValue = arg
      }

      /* stopParsingAtFirstUnknown logic */
      unknownsFound = currentDefinition.name === '_unknown'

      if (unknownsFound && optionUtil.optEquals.test(arg)) {
        yield [ currentDefinition.name, arg ]
      } else {
        yield [ currentDefinition.name, optionValue ]
      }
    }
  }
}

module.exports = ArgvIterator
