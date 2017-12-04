'use strict'

/**
 * @module command-line-args
 */
module.exports = commandLineArgs

/**
 * Returns an object containing all options set on the command line. By default it parses the global  [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.
 *
 * By default, an exception is thrown if the user sets an unknown option (one without a valid [definition](#exp_module_definition--OptionDefinition)). To enable __partial parsing__, invoke `commandLineArgs` with the `partial` option - all unknown arguments will be returned in the `_unknown` property.
 *
 *
 * @param {module:definition[]} - An array of [OptionDefinition](#exp_module_definition--OptionDefinition) objects
 * @param {object} [options] - Options.
 * @param {string[]} [options.argv] - An array of strings, which if passed will be parsed instead  of `process.argv`.
 * @param {boolean} [options.partial] - If `true`, an array of unknown arguments is returned in the `_unknown` property of the output.
 * @param {boolean} [options.greedy] - Set to false to disable greedy parsing.
 * @param {boolean} [options.strict] - Throw on unaccounted-for values.
 * @param {boolean} [options.stopParsingAtFirstUnknown] - If `true`, the parsing will stop at the first unknown argument and the remaining arguments will be put in `_unknown`.
 * @returns {object}
 * @throws `UNKNOWN_OPTION` if `options.partial` is false and the user set an undefined option
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
  argvIterator.argv.validate(optionDefinitions, options)

  const Option = require('./lib/option')

  const OutputClass = optionDefinitions.isGrouped() ? require('./lib/output-grouped') : require('./lib/output')
  const output = new OutputClass(optionDefinitions)
  for (const [ name, value ] of argvIterator) {
    const def = optionDefinitions.get(name)
    let option
    if (output.has(name)) {
      option = output.get(name)
    } else {
      option = Option.create(def)
      output.set(def.name, option)
    }
    try {
      option.set(value)
    } catch (err) {
      if (!options.strict && err.name === 'already_set') {
        output.get('_unknown').set(value)
      } else {
        throw err
      }
    }
  }

  return output.toObject({ skipUnknown: !options.partial })
}

/*
output.set(def, arg)

arg can be
* a value
* a long option name
* a short option name
* short option combination
* --option=value

THIS ARGV:
const argv = [ 'file1', '--files', 'file2', '-t', '--two=3', 'file3', '-ab', '--files=file4' ]

would yield this output:

 */
