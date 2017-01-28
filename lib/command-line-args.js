'use strict'

/**
 * @module command-line-args
 */
module.exports = commandLineArgs

/**
 * Returns an object containing all options set on the command line. By default it parses the global  [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.
 *
 * @param {module:definition[]} - An array of [OptionDefinition](#exp_module_definition--OptionDefinition) objects
 * @param [options] {object} - Options.
 * @param [options.partial] {boolean} - If `true`, unknown and unwanted arguments are returned in the `_unknown` property.
 * @param [options.argv] {string[]} - An array of strings, which if passed will be parsed instead  of `process.argv`.
 * @returns {object}
 * @throws `UNKNOWN_OPTION` if `options.partial` is false and the user set an option without a definition
 * @throws `NAME_MISSING` if an option definition is missing the required `name` property
 * @throws `INVALID_TYPE` if an option definition has a `type` value that's not a function
 * @throws `INVALID_ALIAS` if an alias is numeric, a hyphen or a length other than 1
 * @throws `DUPLICATE_NAME` if an option definition name was used more than once
 * @throws `DUPLICATE_ALIAS` if an option definition alias was used more than once
 * @throws `DUPLICATE_DEFAULT_OPTION` if more than one option definition has `defaultOption: true`
 * @alias module:command-line-args
 * @example
 * ```js
 * const commandLineArgs = require('command-line-args')
 * const options = commandLineArgs([
 *   { name: 'file' },
 *   { name: 'verbose' },
 *   { name: 'depth'}
 * ])
 * ```
 */
function commandLineArgs (optionDefinitions, options) {
  options = options || {}
  const Definitions = require('./definitions')
  const option = require('./option')
  const Argv = require('./argv')
  const Output = require('./output')
  const GroupedOutput = require('./grouped-output')

  const definitions = new Definitions()
  definitions.load(optionDefinitions)
  const argv = new Argv()
  argv.load(options.argv)
  argv.expandOptionEqualsNotation()
  argv.expandGetoptNotation()
  argv.validate(definitions, options)

  const output = definitions.isGrouped() ? new GroupedOutput(definitions, options) : new Output(definitions, options)
  let optionName

  /* walk argv building the output */
  argv.forEach(arg => {
    if (option.isOption(arg)) {
      optionName = output.set(arg) ? undefined : arg
    } else {
      optionName = output.set(optionName, arg) ? undefined : optionName
    }
  })

  return output.toObject()
}
