'use strict'

/**
 * @module command-line-args
 */
module.exports = commandLineArgs

/**
 * Returns an object containing all option values set on the command line. By default it parses the global  [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.
 *
 * Parsing is strict by default, an exception is thrown if the user sets either an unknown option (one without a valid [definition](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md)) or value. To enable [partial parsing](https://github.com/75lb/command-line-args/wiki/Partial-mode-example), invoke `commandLineArgs` with the `partial` option - all unknown arguments will be returned in the `_unknown` property.
 *
 *
 * @param {module:definition[]} - An array of [OptionDefinition](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md) objects
 * @param {object} [options] - Options.
 * @param {string[]} [options.argv] - An array of strings which, if present will be parsed instead  of `process.argv`.
 * @param {boolean} [options.partial] - If `true`, an array of unknown arguments is returned in the `_unknown` property of the output.
 * @param {boolean} [options.stopAtFirstUnknown] - If `true`, the parsing will stop at the first unknown argument and the remaining arguments will be put in `_unknown`.
 * @param {boolean} [options.camelCase] - If set, options with hypenated names (e.g. `move-to`) will be returned in camel-case (e.g. `moveTo`).
 * @returns {object}
 * @throws `UNKNOWN_OPTION` if `options.partial` is false and the user set an undefined option (stored at `err.optionName`)
 * @throws `INVALID_DEFINITIONS`
 *   - If an option definition is missing the required `name` property
 *   - If an option definition has a `type` value that's not a function
 *   - If an alias is numeric, a hyphen or a length other than 1
 *   - If an option definition name was used more than once
 *   - If an option definition alias was used more than once
 *   - If more than one option definition has `defaultOption: true`
 * @alias module:command-line-args
 */
function commandLineArgs (optionDefinitions, options) {
  options = options || {}
  if (options.stopAtFirstUnknown) options.partial = true
  const Definitions = require('./lib/definitions')
  optionDefinitions = Definitions.from(optionDefinitions)

  const ArgvParser = require('./lib/argv-parser')
  const parser = new ArgvParser(optionDefinitions, { argv: options.argv, stopAtFirstUnknown: options.stopAtFirstUnknown })

  const optionUtil = require('./lib/option-util')
  const Option = require('./lib/option')
  const OutputClass = optionDefinitions.isGrouped() ? require('./lib/output-grouped') : require('./lib/output')
  const output = new OutputClass(optionDefinitions)

  for (const argInfo of parser) {
    if (!options.partial) {
      if (argInfo.event === 'unknown_value') {
        const err = new Error(`Unknown value: ${argInfo.arg}`)
        err.name = 'UNKNOWN_VALUE'
        err.value = argInfo.arg
        throw err
      } else if (argInfo.event === 'unknown_option') {
        const err = new Error(`Unknown option: ${argInfo.arg}`)
        err.name = 'UNKNOWN_OPTION'
        err.optionName = argInfo.arg
        throw err
      }
    }

    let option
    if (output.has(argInfo.name)) {
      option = output.get(argInfo.name)
    } else {
      option = Option.create(argInfo.def)
      output.set(argInfo.name, option)
    }

    if (argInfo.name === '_unknown') {
      option.set(argInfo.arg)
    }  else {
      option.set(argInfo.value)
    }
  }

  const result = output.toObject({ skipUnknown: !options.partial })
  return options.camelCase ? optionUtil.camelCaseObject(result) : result
}
