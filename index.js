'use strict'

/**
 * @module command-line-args
 */
module.exports = commandLineArgs

/**
 * Returns an object containing all option values set on the command line. By default it parses the global  [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.
 *
 * By default, an exception is thrown if the user sets an unknown option (one without a valid [definition](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md)). To enable __partial parsing__, invoke `commandLineArgs` with the `partial` option - all unknown arguments will be returned in the `_unknown` property.
 *
 *
 * @param {module:definition[]} - An array of [OptionDefinition](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md) objects
 * @param {object} [options] - Options.
 * @param {string[]} [options.argv] - An array of strings which, if present will be parsed instead  of `process.argv`.
 * @param {boolean} [options.partial] - If `true`, an array of unknown arguments is returned in the `_unknown` property of the output.
 * @param {boolean} [options.greedy] - Set to false to disable greedy parsing.
 * @param {boolean} [options.strictValues] - Throw on unaccounted-for values.
 * @param {boolean} [options.stopParsingAtFirstUnknown] - If `true`, the parsing will stop at the first unknown argument and the remaining arguments will be put in `_unknown`.
 * @param {boolean} [options.camelCase] - If set, options with hypenated names (e.g. `move-to`) will be returned in camel-case (e.g. `moveTo`).
 * @returns {object}
 * @throws `UNKNOWN_OPTION` if `options.partial` is false and the user set an undefined option (stored at `err.optionName`)
 * @throws `NAME_MISSING` if an option definition is missing the required `name` property
 * @throws `INVALID_TYPE` if an option definition has a `type` value that's not a function
 * @throws `INVALID_ALIAS` if an alias is numeric, a hyphen or a length other than 1
 * @throws `DUPLICATE_NAME` if an option definition name was used more than once
 * @throws `DUPLICATE_ALIAS` if an option definition alias was used more than once
 * @throws `DUPLICATE_DEFAULT_OPTION` if more than one option definition has `defaultOption: true`
 * @alias module:command-line-args
 */
function commandLineArgs (optionDefinitions, options) {
  options = options || {}
  const Definitions = require('./lib/definitions')
  optionDefinitions = Definitions.from(optionDefinitions)

  const ArgvIterator = require('./lib/argv-iterator')
  const argvIterator = new ArgvIterator(optionDefinitions, options)

  const optionUtil = require('./lib/option-util')
  optionUtil.validate(optionDefinitions, options, argvIterator.argv)

  const Option = require('./lib/option')

  const OutputClass = optionDefinitions.isGrouped() ? require('./lib/output-grouped') : require('./lib/output')
  const output = new OutputClass(optionDefinitions)

  let unknownsFound = false

  for (const item of argvIterator) {
    const name = item[0]
    const value = item[1]

    if (name === '_unknown') unknownsFound = true
    if (options.stopParsingAtFirstUnknown && unknownsFound) {
      output.get('_unknown').set(item[2])
      continue
    }

    let option
    if (output.has(name)) {
      option = output.get(name)
    } else {
      option = Option.create(optionDefinitions.get(name))
      output.set(name, option)
    }

    /* only set a non-mulitple defaultValue once.. */
    if (option.definition.defaultOption && !option.definition.multiple && option.valueSource === 'argv') {
      if (options.strictValues) {
        const err = new Error('Unknown value: ' + value)
        err.name = 'UNKNOWN_VALUE'
        err.value = value
        throw err
      } else {
        unknownsFound = true
        output.get('_unknown').set(value)
      }
    } else {
      option.set(value)
    }
  }

  const result = output.toObject({ skipUnknown: !options.partial })
  return options.camelCase ? optionUtil.camelCaseObject(result) : result
}
