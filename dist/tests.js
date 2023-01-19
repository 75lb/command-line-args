'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var TestRunner = _interopDefault(require('test-runner'));
var a = _interopDefault(require('assert'));
var camelCase = _interopDefault(require('lodash.camelcase'));

/**
 * Takes any input and guarantees an array back.
 *
 * - Converts array-like objects (e.g. `arguments`, `Set`) to a real array.
 * - Converts `undefined` to an empty array.
 * - Converts any another other, singular value (including `null`, objects and iterables other than `Set`) into an array containing that value.
 * - Ignores input which is already an array.
 *
 * @module array-back
 * @example
 * > const arrayify = require('array-back')
 *
 * > arrayify(undefined)
 * []
 *
 * > arrayify(null)
 * [ null ]
 *
 * > arrayify(0)
 * [ 0 ]
 *
 * > arrayify([ 1, 2 ])
 * [ 1, 2 ]
 *
 * > arrayify(new Set([ 1, 2 ]))
 * [ 1, 2 ]
 *
 * > function f(){ return arrayify(arguments); }
 * > f(1,2,3)
 * [ 1, 2, 3 ]
 */

function isObject (input) {
  return typeof input === 'object' && input !== null
}

function isArrayLike (input) {
  return isObject(input) && typeof input.length === 'number'
}

/**
 * @param {*} - The input value to convert to an array
 * @returns {Array}
 * @alias module:array-back
 */
function arrayify (input) {
  if (Array.isArray(input)) {
    return input
  }

  if (input === undefined) {
    return []
  }

  if (isArrayLike(input) || input instanceof Set) {
    return Array.from(input)
  }

  return [input]
}

/**
 * Takes any input and guarantees an array back.
 *
 * - converts array-like objects (e.g. `arguments`) to a real array
 * - converts `undefined` to an empty array
 * - converts any another other, singular value (including `null`) into an array containing that value
 * - ignores input which is already an array
 *
 * @module array-back
 * @example
 * > const arrayify = require('array-back')
 *
 * > arrayify(undefined)
 * []
 *
 * > arrayify(null)
 * [ null ]
 *
 * > arrayify(0)
 * [ 0 ]
 *
 * > arrayify([ 1, 2 ])
 * [ 1, 2 ]
 *
 * > function f(){ return arrayify(arguments); }
 * > f(1,2,3)
 * [ 1, 2, 3 ]
 */

function isObject$1 (input) {
  return typeof input === 'object' && input !== null
}

function isArrayLike$1 (input) {
  return isObject$1(input) && typeof input.length === 'number'
}

/**
 * @param {*} - the input value to convert to an array
 * @returns {Array}
 * @alias module:array-back
 */
function arrayify$1 (input) {
  if (Array.isArray(input)) {
    return input
  } else {
    if (input === undefined) {
      return []
    } else if (isArrayLike$1(input)) {
      return Array.prototype.slice.call(input)
    } else {
      return [ input ]
    }
  }
}

/**
 * Find and either replace or remove items in an array.
 *
 * @module find-replace
 * @example
 * > const findReplace = require('find-replace')
 * > const numbers = [ 1, 2, 3]
 *
 * > findReplace(numbers, n => n === 2, 'two')
 * [ 1, 'two', 3 ]
 *
 * > findReplace(numbers, n => n === 2, [ 'two', 'zwei' ])
 * [ 1, [ 'two', 'zwei' ], 3 ]
 *
 * > findReplace(numbers, n => n === 2, 'two', 'zwei')
 * [ 1, 'two', 'zwei', 3 ]
 *
 * > findReplace(numbers, n => n === 2) // no replacement, so remove
 * [ 1, 3 ]
 */

/**
 * @param {array} - The input array
 * @param {testFn} - A predicate function which, if returning `true` causes the current item to be operated on.
 * @param [replaceWith] {...any} - If specified, found values will be replaced with these values, else removed.
 * @returns {array}
 * @alias module:find-replace
 */
function findReplace (array, testFn) {
  const found = [];
  const replaceWiths = arrayify$1(arguments);
  replaceWiths.splice(0, 2);

  arrayify$1(array).forEach((value, index) => {
    let expanded = [];
    replaceWiths.forEach(replaceWith => {
      if (typeof replaceWith === 'function') {
        expanded = expanded.concat(replaceWith(value));
      } else {
        expanded.push(replaceWith);
      }
    });

    if (testFn(value)) {
      found.push({
        index: index,
        replaceWithValue: expanded
      });
    }
  });

  found.reverse().forEach(item => {
    const spliceArgs = [ item.index, 1 ].concat(item.replaceWithValue);
    array.splice.apply(array, spliceArgs);
  });

  return array
}

/**
 * Some useful tools for working with `process.argv`.
 *
 * @module argv-tools
 * @typicalName argvTools
 * @example
 * const argvTools = require('argv-tools')
 */

/**
 * Regular expressions for matching option formats.
 * @static
 */
const re = {
  short: /^-([^\d-])$/,
  long: /^--(\S+)/,
  combinedShort: /^-[^\d-]{2,}$/,
  optEquals: /^(--\S+?)=(.*)/
};

/**
 * Array subclass encapsulating common operations on `process.argv`.
 * @static
 */
class ArgvArray extends Array {
  /**
   * Clears the array has loads the supplied input.
   * @param {string[]} argv - The argv list to load. Defaults to `process.argv`.
   */
  load (argv) {
    this.clear();
    if (argv && argv !== process.argv) {
      argv = arrayify(argv);
    } else {
      /* if no argv supplied, assume we are parsing process.argv */
      argv = process.argv.slice(0);
      const deleteCount = process.execArgv.some(isExecArg) ? 1 : 2;
      argv.splice(0, deleteCount);
    }
    argv.forEach(arg => this.push(String(arg)));
  }

  /**
   * Clear the array.
   */
  clear () {
    this.length = 0;
  }

  /**
   * expand ``--option=value` style args.
   */
  expandOptionEqualsNotation () {
    if (this.some(arg => re.optEquals.test(arg))) {
      const expandedArgs = [];
      this.forEach(arg => {
        const matches = arg.match(re.optEquals);
        if (matches) {
          expandedArgs.push(matches[1], matches[2]);
        } else {
          expandedArgs.push(arg);
        }
      });
      this.clear();
      this.load(expandedArgs);
    }
  }

  /**
   * expand getopt-style combinedShort options.
   */
  expandGetoptNotation () {
    if (this.hasCombinedShortOptions()) {
      findReplace(this, re.combinedShort, expandCombinedShortArg);
    }
  }

  /**
   * Returns true if the array contains combined short options (e.g. `-ab`).
   * @returns {boolean}
   */
  hasCombinedShortOptions () {
    return this.some(arg => re.combinedShort.test(arg))
  }

  static from (argv) {
    const result = new this();
    result.load(argv);
    return result
  }
}

/**
 * Expand a combined short option.
 * @param {string} - the string to expand, e.g. `-ab`
 * @returns {string[]}
 * @static
 */
function expandCombinedShortArg (arg) {
  /* remove initial hypen */
  arg = arg.slice(1);
  return arg.split('').map(letter => '-' + letter)
}

/**
 * Returns true if the supplied arg matches `--option=value` notation.
 * @param {string} - the arg to test, e.g. `--one=something`
 * @returns {boolean}
 * @static
 */
function isOptionEqualsNotation (arg) {
  return re.optEquals.test(arg)
}

/**
 * Returns true if the supplied arg is in either long (`--one`) or short (`-o`) format.
 * @param {string} - the arg to test, e.g. `--one`
 * @returns {boolean}
 * @static
 */
function isOption (arg) {
  return (re.short.test(arg) || re.long.test(arg)) && !re.optEquals.test(arg)
}

/**
 * Returns true if the supplied arg is in long (`--one`) format.
 * @param {string} - the arg to test, e.g. `--one`
 * @returns {boolean}
 * @static
 */
function isLongOption (arg) {
  return re.long.test(arg) && !isOptionEqualsNotation(arg)
}

/**
 * Returns the name from a long, short or `--options=value` arg.
 * @param {string} - the arg to inspect, e.g. `--one`
 * @returns {string}
 * @static
 */
function getOptionName (arg) {
  if (re.short.test(arg)) {
    return arg.match(re.short)[1]
  } else if (isLongOption(arg)) {
    return arg.match(re.long)[1]
  } else if (isOptionEqualsNotation(arg)) {
    return arg.match(re.optEquals)[1].replace(/^--/, '')
  } else {
    return null
  }
}

function isValue (arg) {
  return !(isOption(arg) || re.combinedShort.test(arg) || re.optEquals.test(arg))
}

function isExecArg (arg) {
  return ['--eval', '-e'].indexOf(arg) > -1 || arg.startsWith('--eval=')
}

/**
 * Isomorphic, functional type-checking for Javascript.
 * @module typical
 * @typicalname t
 * @example
 * const t = require('typical')
 * const allDefined = array.every(t.isDefined)
 */

/**
 * Returns true if input is a number. It is a more reasonable alternative to `typeof n` which returns `number` for `NaN` and `Infinity`.
 *
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 * @example
 * > t.isNumber(0)
 * true
 * > t.isNumber(1)
 * true
 * > t.isNumber(1.1)
 * true
 * > t.isNumber(0xff)
 * true
 * > t.isNumber(0644)
 * true
 * > t.isNumber(6.2e5)
 * true
 * > t.isNumber(NaN)
 * false
 * > t.isNumber(Infinity)
 * false
 */
function isNumber (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

/**
 * A plain object is a simple object literal, it is not an instance of a class. Returns true if the input `typeof` is `object` and directly decends from `Object`.
 *
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 * @example
 * > t.isPlainObject({ something: 'one' })
 * true
 * > t.isPlainObject(new Date())
 * false
 * > t.isPlainObject([ 0, 1 ])
 * false
 * > t.isPlainObject(/test/)
 * false
 * > t.isPlainObject(1)
 * false
 * > t.isPlainObject('one')
 * false
 * > t.isPlainObject(null)
 * false
 * > t.isPlainObject((function * () {})())
 * false
 * > t.isPlainObject(function * () {})
 * false
 */
function isPlainObject (input) {
  return input !== null && typeof input === 'object' && input.constructor === Object
}

/**
 * An array-like value has all the properties of an array yet is not an array instance. An example is the `arguments` object. Returns `true`` if the input value is an object, not `null`` and has a `length` property set with a numeric value.
 *
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 * @example
 * function sum(x, y){
 *   console.log(t.isArrayLike(arguments))
 *   // prints `true`
 * }
 */
function isArrayLike$2 (input) {
  return isObject$2(input) && typeof input.length === 'number'
}

/**
 * Returns true if the typeof input is `'object'` but not null.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isObject$2 (input) {
  return typeof input === 'object' && input !== null
}

/**
 * Returns true if the input value is defined.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isDefined (input) {
  return typeof input !== 'undefined'
}

/**
 * Returns true if the input value is undefined.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isUndefined (input) {
  return !isDefined(input)
}

/**
 * Returns true if the input value is null.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isNull (input) {
 return input === null
}

/**
 * Returns true if the input value is not one of `undefined`, `null`, or `NaN`.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isDefinedValue (input) {
 return isDefined(input) && !isNull(input) && !Number.isNaN(input)
}

/**
 * Returns true if the input value is an ES2015 `class`.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isClass (input) {
  if (typeof input === 'function') {
    return /^class /.test(Function.prototype.toString.call(input))
  } else {
    return false
  }
}

/**
 * Returns true if the input is a string, number, symbol, boolean, null or undefined value.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isPrimitive (input) {
  if (input === null) return true
  switch (typeof input) {
    case 'string':
    case 'number':
    case 'symbol':
    case 'undefined':
    case 'boolean':
      return true
    default:
      return false
  }
}

/**
 * Returns true if the input is a Promise.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isPromise (input) {
  if (input) {
    const isPromise = isDefined(Promise) && input instanceof Promise;
    const isThenable = input.then && typeof input.then === 'function';
    return !!(isPromise || isThenable)
  } else {
    return false
  }
}

/**
 * Returns true if the input is an iterable (`Map`, `Set`, `Array`, Generator etc.).
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 * @example
 * > t.isIterable('string')
 * true
 * > t.isIterable(new Map())
 * true
 * > t.isIterable([])
 * true
 * > t.isIterable((function * () {})())
 * true
 * > t.isIterable(Promise.resolve())
 * false
 * > t.isIterable(Promise)
 * false
 * > t.isIterable(true)
 * false
 * > t.isIterable({})
 * false
 * > t.isIterable(0)
 * false
 * > t.isIterable(1.1)
 * false
 * > t.isIterable(NaN)
 * false
 * > t.isIterable(Infinity)
 * false
 * > t.isIterable(function () {})
 * false
 * > t.isIterable(Date)
 * false
 * > t.isIterable()
 * false
 * > t.isIterable({ then: function () {} })
 * false
 */
function isIterable (input) {
  if (input === null || !isDefined(input)) {
    return false
  } else {
    return (
      typeof input[Symbol.iterator] === 'function' ||
      typeof input[Symbol.asyncIterator] === 'function'
    )
  }
}

/**
 * Returns true if the input value is a string. The equivalent of `typeof input === 'string'` for use in funcitonal contexts.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isString (input) {
  return typeof input === 'string'
}

/**
 * Returns true if the input value is a function. The equivalent of `typeof input === 'function'` for use in funcitonal contexts.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isFunction (input) {
  return typeof input === 'function'
}

var t = {
  isNumber,
  isPlainObject,
  isArrayLike: isArrayLike$2,
  isObject: isObject$2,
  isDefined,
  isUndefined,
  isNull,
  isDefinedValue,
  isClass,
  isPrimitive,
  isPromise,
  isIterable,
  isString,
  isFunction
};

/**
 * @module option-definition
 */

/**
 * Describes a command-line option. Additionally, if generating a usage guide with [command-line-usage](https://github.com/75lb/command-line-usage) you could optionally add `description` and `typeLabel` properties to each definition.
 *
 * @alias module:option-definition
 * @typicalname option
 */
class OptionDefinition {
  constructor (definition) {
    /**
    * The only required definition property is `name`, so the simplest working example is
    * ```js
    * const optionDefinitions = [
    *   { name: 'file' },
    *   { name: 'depth' }
    * ]
    * ```
    *
    * Where a `type` property is not specified it will default to `String`.
    *
    * | #   | argv input | commandLineArgs() output |
    * | --- | -------------------- | ------------ |
    * | 1   | `--file` | `{ file: null }` |
    * | 2   | `--file lib.js` | `{ file: 'lib.js' }` |
    * | 3   | `--depth 2` | `{ depth: '2' }` |
    *
    * Unicode option names and aliases are valid, for example:
    * ```js
    * const optionDefinitions = [
    *   { name: 'один' },
    *   { name: '两' },
    *   { name: 'три', alias: 'т' }
    * ]
    * ```
    * @type {string}
    */
    this.name = definition.name;

    /**
    * The `type` value is a setter function (you receive the output from this), enabling you to be specific about the type and value received.
    *
    * The most common values used are `String` (the default), `Number` and `Boolean` but you can use a custom function, for example:
    *
    * ```js
    * const fs = require('fs')
    *
    * class FileDetails {
    *   constructor (filename) {
    *     this.filename = filename
    *     this.exists = fs.existsSync(filename)
    *   }
    * }
    *
    * const cli = commandLineArgs([
    *   { name: 'file', type: filename => new FileDetails(filename) },
    *   { name: 'depth', type: Number }
    * ])
    * ```
    *
    * | #   | argv input | commandLineArgs() output |
    * | --- | ----------------- | ------------ |
    * | 1   | `--file asdf.txt` | `{ file: { filename: 'asdf.txt', exists: false } }` |
    *
    * The `--depth` option expects a `Number`. If no value was set, you will receive `null`.
    *
    * | #   | argv input | commandLineArgs() output |
    * | --- | ----------------- | ------------ |
    * | 2   | `--depth` | `{ depth: null }` |
    * | 3   | `--depth 2` | `{ depth: 2 }` |
    *
    * @type {function}
    * @default String
    */
    this.type = definition.type || String;

    /**
    * getopt-style short option names. Can be any single character (unicode included) except a digit or hyphen.
    *
    * ```js
    * const optionDefinitions = [
    *   { name: 'hot', alias: 'h', type: Boolean },
    *   { name: 'discount', alias: 'd', type: Boolean },
    *   { name: 'courses', alias: 'c' , type: Number }
    * ]
    * ```
    *
    * | #   | argv input | commandLineArgs() output |
    * | --- | ------------ | ------------ |
    * | 1   | `-hcd` | `{ hot: true, courses: null, discount: true }` |
    * | 2   | `-hdc 3` | `{ hot: true, discount: true, courses: 3 }` |
    *
    * @type {string}
    */
    this.alias = definition.alias;

    /**
    * Set this flag if the option takes a list of values. You will receive an array of values, each passed through the `type` function (if specified).
    *
    * ```js
    * const optionDefinitions = [
    *   { name: 'files', type: String, multiple: true }
    * ]
    * ```
    *
    * Note, examples 1 and 3 below demonstrate "greedy" parsing which can be disabled by using `lazyMultiple`.
    *
    * | #   | argv input | commandLineArgs() output |
    * | --- | ------------ | ------------ |
    * | 1   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
    * | 2   | `--files one.js --files two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
    * | 3   | `--files *` | `{ files: [ 'one.js', 'two.js' ] }` |
    *
    * @type {boolean}
    */
    this.multiple = definition.multiple;

    /**
     * Identical to `multiple` but with greedy parsing disabled.
     *
     * ```js
     * const optionDefinitions = [
     *   { name: 'files', lazyMultiple: true },
     *   { name: 'verbose', alias: 'v', type: Boolean, lazyMultiple: true }
     * ]
     * ```
     *
     * | #   | argv input | commandLineArgs() output |
     * | --- | ------------ | ------------ |
     * | 1   | `--files one.js --files two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
     * | 2   | `-vvv` | `{ verbose: [ true, true, true ] }` |
     *
     * @type {boolean}
     */
    this.lazyMultiple = definition.lazyMultiple;

    /**
    * Any values unaccounted for by an option definition will be set on the `defaultOption`. This flag is typically set on the most commonly-used option to make for more concise usage (i.e. `$ example *.js` instead of `$ example --files *.js`).
    *
    * ```js
    * const optionDefinitions = [
    *   { name: 'files', multiple: true, defaultOption: true }
    * ]
    * ```
    *
    * | #   | argv input | commandLineArgs() output |
    * | --- | ------------ | ------------ |
    * | 1   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
    * | 2   | `one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
    * | 3   | `*` | `{ files: [ 'one.js', 'two.js' ] }` |
    *
    * @type {boolean}
    */
    this.defaultOption = definition.defaultOption;

    /**
    * An initial value for the option.
    *
    * ```js
    * const optionDefinitions = [
    *   { name: 'files', multiple: true, defaultValue: [ 'one.js' ] },
    *   { name: 'max', type: Number, defaultValue: 3 }
    * ]
    * ```
    *
    * | #   | argv input | commandLineArgs() output |
    * | --- | ------------ | ------------ |
    * | 1   |  | `{ files: [ 'one.js' ], max: 3 }` |
    * | 2   | `--files two.js` | `{ files: [ 'two.js' ], max: 3 }` |
    * | 3   | `--max 4` | `{ files: [ 'one.js' ], max: 4 }` |
    *
    * @type {*}
    */
    this.defaultValue = definition.defaultValue;

    /**
    * When your app has a large amount of options it makes sense to organise them in groups.
    *
    * There are two automatic groups: `_all` (contains all options) and `_none` (contains options without a `group` specified in their definition).
    *
    * ```js
    * const optionDefinitions = [
    *   { name: 'verbose', group: 'standard' },
    *   { name: 'help', group: [ 'standard', 'main' ] },
    *   { name: 'compress', group: [ 'server', 'main' ] },
    *   { name: 'static', group: 'server' },
    *   { name: 'debug' }
    * ]
    * ```
    *
    *<table>
    *  <tr>
    *    <th>#</th><th>Command Line</th><th>commandLineArgs() output</th>
    *  </tr>
    *  <tr>
    *    <td>1</td><td><code>--verbose</code></td><td><pre><code>
    *{
    *  _all: { verbose: true },
    *  standard: { verbose: true }
    *}
    *</code></pre></td>
    *  </tr>
    *  <tr>
    *    <td>2</td><td><code>--debug</code></td><td><pre><code>
    *{
    *  _all: { debug: true },
    *  _none: { debug: true }
    *}
    *</code></pre></td>
    *  </tr>
    *  <tr>
    *    <td>3</td><td><code>--verbose --debug --compress</code></td><td><pre><code>
    *{
    *  _all: {
    *    verbose: true,
    *    debug: true,
    *    compress: true
    *  },
    *  standard: { verbose: true },
    *  server: { compress: true },
    *  main: { compress: true },
    *  _none: { debug: true }
    *}
    *</code></pre></td>
    *  </tr>
    *  <tr>
    *    <td>4</td><td><code>--compress</code></td><td><pre><code>
    *{
    *  _all: { compress: true },
    *  server: { compress: true },
    *  main: { compress: true }
    *}
    *</code></pre></td>
    *  </tr>
    *</table>
    *
    * @type {string|string[]}
    */
    this.group = definition.group;

    /* pick up any remaining properties */
    for (const prop in definition) {
      if (!this[prop]) this[prop] = definition[prop];
    }
  }

  isBoolean () {
    return this.type === Boolean || (t.isFunction(this.type) && this.type.name === 'Boolean')
  }

  isMultiple () {
    return this.multiple || this.lazyMultiple
  }

  static create (def) {
    const result = new this(def);
    return result
  }
}

/**
 * @module option-definitions
 */

/**
 * @alias module:option-definitions
 */
class Definitions extends Array {
  /**
   * validate option definitions
   * @param {boolean} [caseInsensitive=false] - whether arguments will be parsed in a case insensitive manner
   * @returns {string}
   */
  validate (caseInsensitive) {
    const someHaveNoName = this.some(def => !def.name);
    if (someHaveNoName) {
      halt(
        'INVALID_DEFINITIONS',
        'Invalid option definitions: the `name` property is required on each definition'
      );
    }

    const someDontHaveFunctionType = this.some(def => def.type && typeof def.type !== 'function');
    if (someDontHaveFunctionType) {
      halt(
        'INVALID_DEFINITIONS',
        'Invalid option definitions: the `type` property must be a setter fuction (default: `Boolean`)'
      );
    }

    let invalidOption;

    const numericAlias = this.some(def => {
      invalidOption = def;
      return t.isDefined(def.alias) && t.isNumber(def.alias)
    });
    if (numericAlias) {
      halt(
        'INVALID_DEFINITIONS',
        'Invalid option definition: to avoid ambiguity an alias cannot be numeric [--' + invalidOption.name + ' alias is -' + invalidOption.alias + ']'
      );
    }

    const multiCharacterAlias = this.some(def => {
      invalidOption = def;
      return t.isDefined(def.alias) && def.alias.length !== 1
    });
    if (multiCharacterAlias) {
      halt(
        'INVALID_DEFINITIONS',
        'Invalid option definition: an alias must be a single character'
      );
    }

    const hypenAlias = this.some(def => {
      invalidOption = def;
      return def.alias === '-'
    });
    if (hypenAlias) {
      halt(
        'INVALID_DEFINITIONS',
        'Invalid option definition: an alias cannot be "-"'
      );
    }

    const duplicateName = hasDuplicates(this.map(def => caseInsensitive ? def.name.toLowerCase() : def.name));
    if (duplicateName) {
      halt(
        'INVALID_DEFINITIONS',
        'Two or more option definitions have the same name'
      );
    }

    const duplicateAlias = hasDuplicates(this.map(def => caseInsensitive && t.isDefined(def.alias) ? def.alias.toLowerCase() : def.alias));
    if (duplicateAlias) {
      halt(
        'INVALID_DEFINITIONS',
        'Two or more option definitions have the same alias'
      );
    }

    const duplicateDefaultOption = this.filter(def => def.defaultOption === true).length > 1;
    if (duplicateDefaultOption) {
      halt(
        'INVALID_DEFINITIONS',
        'Only one option definition can be the defaultOption'
      );
    }

    const defaultBoolean = this.some(def => {
      invalidOption = def;
      return def.isBoolean() && def.defaultOption
    });
    if (defaultBoolean) {
      halt(
        'INVALID_DEFINITIONS',
        `A boolean option ["${invalidOption.name}"] can not also be the defaultOption.`
      );
    }
  }

  /**
   * Get definition by option arg (e.g. `--one` or `-o`)
   * @param {string} [arg] the argument name to get the definition for
   * @param {boolean} [caseInsensitive] whether to use case insensitive comparisons when finding the appropriate definition
   * @returns {Definition}
   */
  get (arg, caseInsensitive) {
    if (isOption(arg)) {
      if (re.short.test(arg)) {
        const shortOptionName = getOptionName(arg);
        if (caseInsensitive) {
          const lowercaseShortOptionName = shortOptionName.toLowerCase();
          return this.find(def => t.isDefined(def.alias) && def.alias.toLowerCase() === lowercaseShortOptionName)
        } else {
          return this.find(def => def.alias === shortOptionName)
        }
      } else {
        const optionName = getOptionName(arg);
        if (caseInsensitive) {
          const lowercaseOptionName = optionName.toLowerCase();
          return this.find(def => def.name.toLowerCase() === lowercaseOptionName)
        } else {
          return this.find(def => def.name === optionName)
        }
      }
    } else {
      return this.find(def => def.name === arg)
    }
  }

  getDefault () {
    return this.find(def => def.defaultOption === true)
  }

  isGrouped () {
    return this.some(def => def.group)
  }

  whereGrouped () {
    return this.filter(containsValidGroup)
  }

  whereNotGrouped () {
    return this.filter(def => !containsValidGroup(def))
  }

  whereDefaultValueSet () {
    return this.filter(def => t.isDefined(def.defaultValue))
  }

  static from (definitions, caseInsensitive) {
    if (definitions instanceof this) return definitions
    const result = super.from(arrayify(definitions), def => OptionDefinition.create(def));
    result.validate(caseInsensitive);
    return result
  }
}

function halt (name, message) {
  const err = new Error(message);
  err.name = name;
  throw err
}

function containsValidGroup (def) {
  return arrayify(def.group).some(group => group)
}

function hasDuplicates (array) {
  const items = {};
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (items[value]) {
      return true
    } else {
      if (t.isDefined(value)) items[value] = true;
    }
  }
}

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
   * @param {boolean} [options.caseInsensitive] - Arguments will be parsed in a case insensitive manner. Defaults to false.
   */
  constructor (definitions, options) {
    this.options = Object.assign({}, options);
    /**
     * Option Definitions
     */
    this.definitions = Definitions.from(definitions, this.options.caseInsensitive);

    /**
     * Argv
     */
    this.argv = ArgvArray.from(this.options.argv);
    if (this.argv.hasCombinedShortOptions()) {
      findReplace(this.argv, re.combinedShort.test.bind(re.combinedShort), arg => {
        arg = arg.slice(1);
        return arg.split('').map(letter => ({ origArg: `-${arg}`, arg: '-' + letter }))
      });
    }
  }

  /**
   * Yields one `{ event, name, value, arg, def }` argInfo object for each arg in `process.argv` (or `options.argv`).
   */
  * [Symbol.iterator] () {
    const definitions = this.definitions;

    let def;
    let value;
    let name;
    let event;
    let singularDefaultSet = false;
    let unknownFound = false;
    let origArg;

    for (let arg of this.argv) {
      if (t.isPlainObject(arg)) {
        origArg = arg.origArg;
        arg = arg.arg;
      }

      if (unknownFound && this.options.stopAtFirstUnknown) {
        yield { event: 'unknown_value', arg, name: '_unknown', value: undefined };
        continue
      }

      /* handle long or short option */
      if (isOption(arg)) {
        def = definitions.get(arg, this.options.caseInsensitive);
        value = undefined;
        if (def) {
          value = def.isBoolean() ? true : null;
          event = 'set';
        } else {
          event = 'unknown_option';
        }

      /* handle --option-value notation */
      } else if (isOptionEqualsNotation(arg)) {
        const matches = arg.match(re.optEquals);
        def = definitions.get(matches[1], this.options.caseInsensitive);
        if (def) {
          if (def.isBoolean()) {
            yield { event: 'unknown_value', arg, name: '_unknown', value, def };
            event = 'set';
            value = true;
          } else {
            event = 'set';
            value = matches[2];
          }
        } else {
          event = 'unknown_option';
        }

      /* handle value */
      } else if (isValue(arg)) {
        if (def) {
          value = arg;
          event = 'set';
        } else {
          /* get the defaultOption */
          def = this.definitions.getDefault();
          if (def && !singularDefaultSet) {
            value = arg;
            event = 'set';
          } else {
            event = 'unknown_value';
            def = undefined;
          }
        }
      }

      name = def ? def.name : '_unknown';
      const argInfo = { event, arg, name, value, def };
      if (origArg) {
        argInfo.subArg = arg;
        argInfo.arg = origArg;
      }
      yield argInfo;

      /* unknownFound logic */
      if (name === '_unknown') unknownFound = true;

      /* singularDefaultSet logic */
      if (def && def.defaultOption && !def.isMultiple() && event === 'set') singularDefaultSet = true;

      /* reset values once consumed and yielded */
      if (def && def.isBoolean()) def = undefined;
      /* reset the def if it's a singular which has been set */
      if (def && !def.multiple && t.isDefined(value) && value !== null) {
        def = undefined;
      }
      value = undefined;
      event = undefined;
      name = undefined;
      origArg = undefined;
    }
  }
}

const runner = new TestRunner();

runner.test('argv-parser: long option, string', function () {
  const optionDefinitions = [
    { name: 'one' }
  ];
  const argv = ['--one', '1'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' }
  ]);
});

runner.test('argv-parser: long option, string repeated', function () {
  const optionDefinitions = [
    { name: 'one' }
  ];
  const argv = ['--one', '1', '--one', '2'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  a.ok(result[3].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '2', name: 'one', value: '2' }
  ]);
});

runner.test('argv-parser: long option, string multiple', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ];
  const argv = ['--one', '1', '2'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: '2', name: 'one', value: '2' }
  ]);
});

runner.test('argv-parser: long option, string multiple then boolean', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true },
    { name: 'two', type: Boolean }
  ];
  const argv = ['--one', '1', '2', '--two'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  a.ok(result[3].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: '2', name: 'one', value: '2' },
    { event: 'set', arg: '--two', name: 'two', value: true }
  ]);
});

runner.test('argv-parser: long option, boolean', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ];
  const argv = ['--one', '1'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(!result[1].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: true },
    { event: 'unknown_value', arg: '1', name: '_unknown', value: undefined }
  ]);
});

runner.test('argv-parser: simple, with unknown values', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ];
  const argv = ['clive', '--one', '1', 'yeah'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(!result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  a.ok(!result[3].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'unknown_value', arg: 'clive', name: '_unknown', value: undefined },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: 'yeah', name: '_unknown', value: undefined }
  ]);
});

runner.test('argv-parser: simple, with singular defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', type: Number },
    { name: 'two', defaultOption: true }
  ];
  const argv = ['clive', '--one', '1', 'yeah'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  a.ok(!result[3].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: 'clive', name: 'two', value: 'clive' },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: 'yeah', name: '_unknown', value: undefined }
  ]);
});

runner.test('argv-parser: simple, with multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', type: Number },
    { name: 'two', defaultOption: true, multiple: true }
  ];
  const argv = ['clive', '--one', '1', 'yeah'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  a.ok(result[3].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: 'clive', name: 'two', value: 'clive' },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: 'yeah', name: 'two', value: 'yeah' }
  ]);
});

runner.test('argv-parser: long option, string lazyMultiple bad', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ];
  const argv = ['--one', '1', '2'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(!result[2].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: '2', name: '_unknown', value: undefined }
  ]);
});

runner.test('argv-parser: long option, string lazyMultiple good', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ];
  const argv = ['--one', '1', '--one', '2'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  a.ok(result[3].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '2', name: 'one', value: '2' }
  ]);
});

runner.test('argv-parser: long option, stopAtFirstUnknown', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' }
  ];
  const argv = ['--one', '1', 'asdf', '--two', '2'];
  const parser = new ArgvParser(optionDefinitions, { argv, stopAtFirstUnknown: true });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(!result[2].def);
  a.ok(!result[3].def);
  a.ok(!result[4].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: 'asdf', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '--two', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '2', name: '_unknown', value: undefined }
  ]);
});

runner.test('argv-parser: long option, stopAtFirstUnknown with defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ];
  const argv = ['1', 'asdf', '--two', '2'];
  const parser = new ArgvParser(optionDefinitions, { argv, stopAtFirstUnknown: true });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(!result[1].def);
  a.ok(!result[2].def);
  a.ok(!result[3].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: 'asdf', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '--two', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '2', name: '_unknown', value: undefined }
  ]);
});

runner.test('argv-parser: long option, stopAtFirstUnknown with defaultOption 2', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ];
  const argv = ['--one', '1', '--', '--two', '2'];
  const parser = new ArgvParser(optionDefinitions, { argv, stopAtFirstUnknown: true });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(!result[2].def);
  a.ok(!result[3].def);
  a.ok(!result[4].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: '--', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '--two', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '2', name: '_unknown', value: undefined }
  ]);
});

runner.test('argv-parser: --option=value', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' }
  ];
  const argv = ['--one=1', '--two=2', '--two='];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one=1', name: 'one', value: '1' },
    { event: 'set', arg: '--two=2', name: 'two', value: '2' },
    { event: 'set', arg: '--two=', name: 'two', value: '' }
  ]);
});

runner.test('argv-parser: --option=value, unknown option', function () {
  const optionDefinitions = [
    { name: 'one' }
  ];
  const argv = ['--three=3'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(!result[0].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'unknown_option', arg: '--three=3', name: '_unknown', value: undefined }
  ]);
});

runner.test('argv-parser: --option=value where option is boolean', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ];
  const argv = ['--one=1'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'unknown_value', arg: '--one=1', name: '_unknown', value: undefined },
    { event: 'set', arg: '--one=1', name: 'one', value: true }
  ]);
});

runner.test('argv-parser: short option, string', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' }
  ];
  const argv = ['-o', '1'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '-o', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' }
  ]);
});

runner.test('argv-parser: combined short option, string', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' }
  ];
  const argv = ['-ot', '1'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'set', arg: '-ot', subArg: '-o', name: 'one', value: null },
    { event: 'set', arg: '-ot', subArg: '-t', name: 'two', value: null },
    { event: 'set', arg: '1', name: 'two', value: '1' }
  ]);
});

runner.test('argv-parser: combined short option, one unknown', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' }
  ];
  const argv = ['-xt', '1'];
  const parser = new ArgvParser(optionDefinitions, { argv });
  const result = Array.from(parser);
  a.ok(!result[0].def);
  a.ok(result[1].def);
  a.ok(result[2].def);
  result.forEach(r => delete r.def);
  a.deepStrictEqual(result, [
    { event: 'unknown_option', arg: '-xt', subArg: '-x', name: '_unknown', value: undefined },
    { event: 'set', arg: '-xt', subArg: '-t', name: 'two', value: null },
    { event: 'set', arg: '1', name: 'two', value: '1' }
  ]);
});

const _value = new WeakMap();

/**
 * Encapsulates behaviour (defined by an OptionDefinition) when setting values
 */
class Option {
  constructor (definition) {
    this.definition = new OptionDefinition(definition);
    this.state = null; /* set or default */
    this.resetToDefault();
  }

  get () {
    return _value.get(this)
  }

  set (val) {
    this._set(val, 'set');
  }

  _set (val, state) {
    const def = this.definition;
    if (def.isMultiple()) {
      /* don't add null or undefined to a multiple */
      if (val !== null && val !== undefined) {
        const arr = this.get();
        if (this.state === 'default') arr.length = 0;
        arr.push(def.type(val));
        this.state = state;
      }
    } else {
      /* throw if already set on a singlar defaultOption */
      if (!def.isMultiple() && this.state === 'set') {
        const err = new Error(`Singular option already set [${this.definition.name}=${this.get()}]`);
        err.name = 'ALREADY_SET';
        err.value = val;
        err.optionName = def.name;
        throw err
      } else if (val === null || val === undefined) {
        _value.set(this, val);
        // /* required to make 'partial: defaultOption with value equal to defaultValue 2' pass */
        // if (!(def.defaultOption && !def.isMultiple())) {
        //   this.state = state
        // }
      } else {
        _value.set(this, def.type(val));
        this.state = state;
      }
    }
  }

  resetToDefault () {
    if (t.isDefined(this.definition.defaultValue)) {
      if (this.definition.isMultiple()) {
        _value.set(this, arrayify(this.definition.defaultValue).slice());
      } else {
        _value.set(this, this.definition.defaultValue);
      }
    } else {
      if (this.definition.isMultiple()) {
        _value.set(this, []);
      } else {
        _value.set(this, null);
      }
    }
    this.state = 'default';
  }

  static create (definition) {
    definition = new OptionDefinition(definition);
    if (definition.isBoolean()) {
      return FlagOption.create(definition)
    } else {
      return new this(definition)
    }
  }
}

class FlagOption extends Option {
  set (val) {
    super.set(true);
  }

  static create (def) {
    return new this(def)
  }
}

const runner$1 = new TestRunner();

runner$1.test('option.set(): defaultValue', function () {
  const option = new Option({ name: 'two', defaultValue: 'two' });
  a.strictEqual(option.get(), 'two');
  option.set('zwei');
  a.strictEqual(option.get(), 'zwei');
});

runner$1.test('option.set(): multiple defaultValue', function () {
  const option = new Option({ name: 'two', multiple: true, defaultValue: ['two', 'zwei'] });
  a.deepStrictEqual(option.get(), ['two', 'zwei']);
  option.set('duo');
  a.deepStrictEqual(option.get(), ['duo']);
});

runner$1.test('option.set(): falsy defaultValue', function () {
  const option = new Option({ name: 'one', defaultValue: 0 });
  a.strictEqual(option.get(), 0);
});

runner$1.test('option.set(): falsy defaultValue 2', function () {
  const option = new Option({ name: 'two', defaultValue: false });
  a.strictEqual(option.get(), false);
});

runner$1.test('option.set(): falsy defaultValue multiple', function () {
  const option = new Option({ name: 'one', defaultValue: 0, multiple: true });
  a.deepStrictEqual(option.get(), [0]);
});

const runner$2 = new TestRunner();

runner$2.test('.get(long option)', function () {
  const definitions = Definitions.from([{ name: 'one' }]);
  a.strictEqual(definitions.get('--one').name, 'one');
});

runner$2.test('.get(short option)', function () {
  const definitions = Definitions.from([{ name: 'one', alias: 'o' }]);
  a.strictEqual(definitions.get('-o').name, 'one');
});

runner$2.test('.get(name)', function () {
  const definitions = Definitions.from([{ name: 'one' }]);
  a.strictEqual(definitions.get('one').name, 'one');
});

runner$2.test('.validate()', function () {
  a.throws(function () {
    const definitions = new Definitions();
    definitions.load([{ name: 'one' }, { name: 'one' }]);
  });
});

class FlagOption$1 extends Option {
  set (val) {
    super.set(true);
  }

  static create (def) {
    return new this(def)
  }
}

const runner$3 = new TestRunner();

runner$3.test('type-boolean: single set', function () {
  const option = new FlagOption$1({ name: 'one', type: Boolean });

  option.set(undefined);
  a.strictEqual(option.get(), true);
});

runner$3.test('type-boolean: single set 2', function () {
  const option = new FlagOption$1({ name: 'one', type: Boolean });

  option.set('true');
  a.strictEqual(option.get(), true);
});

runner$3.test('type-boolean: set twice', function () {
  const option = new FlagOption$1({ name: 'one', type: Boolean });

  option.set(undefined);
  a.strictEqual(option.get(), true);
  a.throws(
    () => option.set('true'),
    err => err.name === 'ALREADY_SET'
  );
});

const origBoolean = Boolean;

/* test in contexts which override the standard global Boolean constructor */
runner$3.test('type-boolean: global Boolean overridden', function () {
  function Boolean () {
    return origBoolean.apply(origBoolean, arguments)
  }

  const option = new FlagOption$1({ name: 'one', type: Boolean });

  option.set();
  a.strictEqual(option.get(), true);
});

runner$3.test('type-boolean-multiple: 1', function () {
  const option = new FlagOption$1({ name: 'one', type: Boolean, multiple: true });

  option.set(undefined);
  option.set(undefined);
  option.set(undefined);

  a.deepStrictEqual(option.get(), [true, true, true]);
});

const runner$4 = new TestRunner();

runner$4.test('option.set(): simple set string', function () {
  const option = Option.create({ name: 'two' });
  a.strictEqual(option.get(), null);
  a.strictEqual(option.state, 'default');
  option.set('zwei');
  a.strictEqual(option.get(), 'zwei');
  a.strictEqual(option.state, 'set');
});

runner$4.test('option.set(): simple set boolean', function () {
  const option = Option.create({ name: 'two', type: Boolean });
  a.strictEqual(option.get(), null);
  a.strictEqual(option.state, 'default');
  option.set();
  a.strictEqual(option.get(), true);
  a.strictEqual(option.state, 'set');
});

runner$4.test('option.set(): simple set string twice', function () {
  const option = Option.create({ name: 'two' });
  a.strictEqual(option.get(), null);
  a.strictEqual(option.state, 'default');
  option.set('zwei');
  a.strictEqual(option.get(), 'zwei');
  a.strictEqual(option.state, 'set');
  a.throws(
    () => option.set('drei'),
    err => err.name === 'ALREADY_SET'
  );
});

runner$4.test('option.set(): simple set boolean twice', function () {
  const option = Option.create({ name: 'two', type: Boolean });
  a.strictEqual(option.get(), null);
  a.strictEqual(option.state, 'default');
  option.set();
  a.strictEqual(option.get(), true);
  a.strictEqual(option.state, 'set');
  a.throws(
    () => option.set(),
    err => err.name === 'ALREADY_SET'
  );
});

runner$4.test('option.set(): string multiple', function () {
  const option = Option.create({ name: 'two', multiple: true });
  a.deepStrictEqual(option.get(), []);
  a.strictEqual(option.state, 'default');
  option.set('1');
  a.deepStrictEqual(option.get(), ['1']);
  a.strictEqual(option.state, 'set');
  option.set('2');
  a.deepStrictEqual(option.get(), ['1', '2']);
  a.strictEqual(option.state, 'set');
});

runner$4.test('option.set: lazyMultiple', function () {
  const option = Option.create({ name: 'one', lazyMultiple: true });
  a.deepStrictEqual(option.get(), []);
  a.strictEqual(option.state, 'default');
  option.set('1');
  a.deepStrictEqual(option.get(), ['1']);
  a.strictEqual(option.state, 'set');
  option.set('2');
  a.deepStrictEqual(option.get(), ['1', '2']);
  a.strictEqual(option.state, 'set');
});

runner$4.test('option.set(): string multiple defaultOption', function () {
  const option = Option.create({ name: 'two', multiple: true, defaultOption: true });
  a.deepStrictEqual(option.get(), []);
  a.strictEqual(option.state, 'default');
  option.set('1');
  a.deepStrictEqual(option.get(), ['1']);
  a.strictEqual(option.state, 'set');
  option.set('2');
  a.deepStrictEqual(option.get(), ['1', '2']);
  a.strictEqual(option.state, 'set');
});

runner$4.test('option.set: lazyMultiple defaultOption', function () {
  const option = Option.create({ name: 'one', lazyMultiple: true, defaultOption: true });
  a.deepStrictEqual(option.get(), []);
  a.strictEqual(option.state, 'default');
  option.set('1');
  a.deepStrictEqual(option.get(), ['1']);
  a.strictEqual(option.state, 'set');
  option.set('2');
  a.deepStrictEqual(option.get(), ['1', '2']);
  a.strictEqual(option.state, 'set');
});

/**
 * A map of { DefinitionNameString: Option }. By default, an Output has an `_unknown` property and any options with defaultValues.
 */
class Output extends Map {
  constructor (definitions) {
    super();
    /**
     * @type {OptionDefinitions}
     */
    this.definitions = Definitions.from(definitions);

    /* by default, an Output has an `_unknown` property and any options with defaultValues */
    this.set('_unknown', Option.create({ name: '_unknown', multiple: true }));
    for (const def of this.definitions.whereDefaultValueSet()) {
      this.set(def.name, Option.create(def));
    }
  }

  toObject (options) {
    options = options || {};
    const output = {};
    for (const item of this) {
      const name = options.camelCase && item[0] !== '_unknown' ? camelCase(item[0]) : item[0];
      const option = item[1];
      if (name === '_unknown' && !option.get().length) continue
      output[name] = option.get();
    }

    if (options.skipUnknown) delete output._unknown;
    return output
  }
}

const runner$5 = new TestRunner();

runner$5.test('output.toObject(): no defs set', function () {
  const output = new Output([
    { name: 'one' }
  ]);
  a.deepStrictEqual(output.toObject(), {});
});

runner$5.test('output.toObject(): one def set', function () {
  const output = new Output([
    { name: 'one' }
  ]);
  const option = Option.create({ name: 'one' });
  option.set('yeah');
  output.set('one', option);
  a.deepStrictEqual(output.toObject(), {
    one: 'yeah'
  });
});

class GroupedOutput extends Output {
  toObject (options) {
    const superOutputNoCamel = super.toObject({ skipUnknown: options.skipUnknown });
    const superOutput = super.toObject(options);
    const unknown = superOutput._unknown;
    delete superOutput._unknown;
    const grouped = {
      _all: superOutput
    };
    if (unknown && unknown.length) grouped._unknown = unknown;

    this.definitions.whereGrouped().forEach(def => {
      const name = options.camelCase ? camelCase(def.name) : def.name;
      const outputValue = superOutputNoCamel[def.name];
      for (const groupName of arrayify(def.group)) {
        grouped[groupName] = grouped[groupName] || {};
        if (t.isDefined(outputValue)) {
          grouped[groupName][name] = outputValue;
        }
      }
    });

    this.definitions.whereNotGrouped().forEach(def => {
      const name = options.camelCase ? camelCase(def.name) : def.name;
      const outputValue = superOutputNoCamel[def.name];
      if (t.isDefined(outputValue)) {
        if (!grouped._none) grouped._none = {};
        grouped._none[name] = outputValue;
      }
    });
    return grouped
  }
}

/**
 * @module command-line-args
 */

/**
 * Returns an object containing all option values set on the command line. By default it parses the global  [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.
 *
 * Parsing is strict by default - an exception is thrown if the user sets a singular option more than once or sets an unknown value or option (one without a valid [definition](https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md)). To be more permissive, enabling [partial](https://github.com/75lb/command-line-args/wiki/Partial-mode-example) or [stopAtFirstUnknown](https://github.com/75lb/command-line-args/wiki/stopAtFirstUnknown) modes will return known options in the usual manner while collecting unknown arguments in a separate `_unknown` property.
 *
 * @param {Array<OptionDefinition>} - An array of [OptionDefinition](https://github.com/75lb/command-line-args/blob/master/doc/option-definition.md) objects
 * @param {object} [options] - Options.
 * @param {string[]} [options.argv] - An array of strings which, if present will be parsed instead  of `process.argv`.
 * @param {boolean} [options.partial] - If `true`, an array of unknown arguments is returned in the `_unknown` property of the output.
 * @param {boolean} [options.stopAtFirstUnknown] - If `true`, parsing will stop at the first unknown argument and the remaining arguments returned in `_unknown`. When set, `partial: true` is also implied.
 * @param {boolean} [options.camelCase] - If `true`, options with hypenated names (e.g. `move-to`) will be returned in camel-case (e.g. `moveTo`).
 * @param {boolean} [options.caseInsensitive] - If `true`, the case of each option name or alias parsed is insignificant. In other words, both `--Verbose` and `--verbose`, `-V` and `-v` would be equivalent. Defaults to false.
 * @returns {object}
 * @throws `UNKNOWN_OPTION` If `options.partial` is false and the user set an undefined option. The `err.optionName` property contains the arg that specified an unknown option, e.g. `--one`.
 * @throws `UNKNOWN_VALUE` If `options.partial` is false and the user set a value unaccounted for by an option definition. The `err.value` property contains the unknown value, e.g. `5`.
 * @throws `ALREADY_SET` If a user sets a singular, non-multiple option more than once. The `err.optionName` property contains the option name that has already been set, e.g. `one`.
 * @throws `INVALID_DEFINITIONS`
 *   - If an option definition is missing the required `name` property
 *   - If an option definition has a `type` value that's not a function
 *   - If an alias is numeric, a hyphen or a length other than 1
 *   - If an option definition name was used more than once
 *   - If an option definition alias was used more than once
 *   - If more than one option definition has `defaultOption: true`
 *   - If a `Boolean` option is also set as the `defaultOption`.
 * @alias module:command-line-args
 */
function commandLineArgs (optionDefinitions, options) {
  options = options || {};
  if (options.stopAtFirstUnknown) options.partial = true;
  optionDefinitions = Definitions.from(optionDefinitions, options.caseInsensitive);

  const parser = new ArgvParser(optionDefinitions, {
    argv: options.argv,
    stopAtFirstUnknown: options.stopAtFirstUnknown,
    caseInsensitive: options.caseInsensitive
  });

  const OutputClass = optionDefinitions.isGrouped() ? GroupedOutput : Output;
  const output = new OutputClass(optionDefinitions);

  /* Iterate the parser setting each known value to the output. Optionally, throw on unknowns. */
  for (const argInfo of parser) {
    const arg = argInfo.subArg || argInfo.arg;
    if (!options.partial) {
      if (argInfo.event === 'unknown_value') {
        const err = new Error(`Unknown value: ${arg}`);
        err.name = 'UNKNOWN_VALUE';
        err.value = arg;
        throw err
      } else if (argInfo.event === 'unknown_option') {
        const err = new Error(`Unknown option: ${arg}`);
        err.name = 'UNKNOWN_OPTION';
        err.optionName = arg;
        throw err
      }
    }

    let option;
    if (output.has(argInfo.name)) {
      option = output.get(argInfo.name);
    } else {
      option = Option.create(argInfo.def);
      output.set(argInfo.name, option);
    }

    if (argInfo.name === '_unknown') {
      option.set(arg);
    } else {
      option.set(argInfo.value);
    }
  }

  return output.toObject({ skipUnknown: !options.partial, camelCase: options.camelCase })
}

const runner$6 = new TestRunner();

runner$6.test('alias-cluster: two flags, one option', function () {
  const optionDefinitions = [
    { name: 'flagA', alias: 'a', type: Boolean },
    { name: 'flagB', alias: 'b', type: Boolean },
    { name: 'three', alias: 'c' }
  ];

  const argv = ['-abc', 'yeah'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flagA: true,
    flagB: true,
    three: 'yeah'
  });
});

runner$6.test('alias-cluster: two flags, one option 2', function () {
  const optionDefinitions = [
    { name: 'flagA', alias: 'a', type: Boolean },
    { name: 'flagB', alias: 'b', type: Boolean },
    { name: 'three', alias: 'c' }
  ];

  const argv = ['-c', 'yeah', '-ab'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flagA: true,
    flagB: true,
    three: 'yeah'
  });
});

runner$6.test('alias-cluster: three string options', function () {
  const optionDefinitions = [
    { name: 'flagA', alias: 'a' },
    { name: 'flagB', alias: 'b' },
    { name: 'three', alias: 'c' }
  ];

  const argv = ['-abc', 'yeah'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    flagA: null,
    flagB: null,
    three: 'yeah'
  });
});

const runner$7 = new TestRunner();

runner$7.test('alias: one string alias', function () {
  const optionDefinitions = [
    { name: 'verbose', alias: 'v' }
  ];
  const argv = ['-v'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    verbose: null
  });
});

runner$7.test('alias: one boolean alias', function () {
  const optionDefinitions = [
    { name: 'dry-run', alias: 'd', type: Boolean }
  ];
  const argv = ['-d'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    'dry-run': true
  });
});

runner$7.test('alias: one boolean, one string', function () {
  const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'colour', alias: 'c' }
  ];
  const argv = ['-v', '-c'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    verbose: true,
    colour: null
  });
});

const runner$8 = new TestRunner();

runner$8.test('ambiguous input: value looks like an option 1', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: ['-c', 'red'] }), {
    colour: 'red'
  });
});

runner$8.test('ambiguous input: value looks like an option 2', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ];
  const argv = ['--colour', '--red'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_OPTION'
  );
});

runner$8.test('ambiguous input: value looks like an option 3', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ];
  a.doesNotThrow(function () {
    commandLineArgs(optionDefinitions, { argv: ['--colour=--red'] });
  });
});

runner$8.test('ambiguous input: value looks like an option 4', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, alias: 'c' }
  ];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: ['--colour=--red'] }), {
    colour: '--red'
  });
});

const runner$9 = new TestRunner();

runner$9.test('bad-input: missing option value should be null', function () {
  const optionDefinitions = [
    { name: 'colour', type: String },
    { name: 'files' }
  ];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: ['--colour'] }), {
    colour: null
  });
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv: ['--colour', '--files', 'yeah'] }), {
    colour: null,
    files: 'yeah'
  });
});

runner$9.test('bad-input: handles arrays with relative paths', function () {
  const optionDefinitions = [
    { name: 'colours', type: String, multiple: true }
  ];
  const argv = ['--colours', '../what', '../ever'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colours: ['../what', '../ever']
  });
});

runner$9.test('bad-input: empty string added to unknown values', function () {
  const optionDefinitions = [
    { name: 'one', type: String },
    { name: 'two', type: Number },
    { name: 'three', type: Number, multiple: true },
    { name: 'four', type: String },
    { name: 'five', type: Boolean }
  ];
  const argv = ['--one', '', '', '--two', '0', '--three=', '', '--four=', '--five='];
  a.throws(() => {
    commandLineArgs(optionDefinitions, { argv });
  });
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv, partial: true }), {
    one: '',
    two: 0,
    three: [0, 0],
    four: '',
    five: true,
    _unknown: ['', '--five=']
  });
});

runner$9.test('bad-input: non-strings in argv', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ];
  const argv = ['--one', 1];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, { one: 1 });
});

const runner$a = new TestRunner();

runner$a.test('camel-case: regular', function () {
  const optionDefinitions = [
    { name: 'one-two' },
    { name: 'three', type: Boolean }
  ];
  const argv = ['--one-two', '1', '--three'];
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true });
  a.deepStrictEqual(result, {
    oneTwo: '1',
    three: true
  });
});

runner$a.test('camel-case: grouped', function () {
  const optionDefinitions = [
    { name: 'one-one', group: 'a' },
    { name: 'two-two', group: 'a' },
    { name: 'three-three', group: 'b', type: Boolean },
    { name: 'four-four' }
  ];
  const argv = ['--one-one', '1', '--two-two', '2', '--three-three', '--four-four', '4'];
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true });
  a.deepStrictEqual(result, {
    a: {
      oneOne: '1',
      twoTwo: '2'
    },
    b: {
      threeThree: true
    },
    _all: {
      oneOne: '1',
      twoTwo: '2',
      threeThree: true,
      fourFour: '4'
    },
    _none: {
      fourFour: '4'
    }
  });
});

runner$a.test('camel-case: grouped with unknowns', function () {
  const optionDefinitions = [
    { name: 'one-one', group: 'a' },
    { name: 'two-two', group: 'a' },
    { name: 'three-three', group: 'b', type: Boolean },
    { name: 'four-four' }
  ];
  const argv = ['--one-one', '1', '--two-two', '2', '--three-three', '--four-four', '4', '--five'];
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true, partial: true });
  a.deepStrictEqual(result, {
    a: {
      oneOne: '1',
      twoTwo: '2'
    },
    b: {
      threeThree: true
    },
    _all: {
      oneOne: '1',
      twoTwo: '2',
      threeThree: true,
      fourFour: '4'
    },
    _none: {
      fourFour: '4'
    },
    _unknown: ['--five']
  });
});

const runner$b = new TestRunner();

runner$b.test('case-insensitive: disabled', function () {
  const optionDefinitions = [
    { name: 'dryRun', type: Boolean, alias: 'd' }];

  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['--DRYrun'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '--DRYrun'
  );
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['-D'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '-D'
  );
});

runner$b.test('case-insensitive: option no value', function () {
  const optionDefinitions = [
    { name: 'dryRun', type: Boolean }];
  const argv = ['--DRYrun'];
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true });
  a.deepStrictEqual(result, {
    dryRun: true
  });
});

runner$b.test('case-insensitive: option with value', function () {
  const optionDefinitions = [
    { name: 'colour', type: String }
  ];
  const argv = ['--coLour', 'red'];
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true });
  a.deepStrictEqual(result, {
    colour: 'red'
  });
});

runner$b.test('case-insensitive: alias', function () {
  const optionDefinitions = [
    { name: 'dryRun', type: Boolean, alias: 'd' }];
  const argv = ['-D'];
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true });
  a.deepStrictEqual(result, {
    dryRun: true
  });
});

runner$b.test('case-insensitive: multiple', function () {
  const optionDefinitions = [
    { name: 'colour', type: String, multiple: true }
  ];
  const argv = ['--colour=red', '--COLOUR', 'green', '--colOUR', 'blue'];
  const result = commandLineArgs(optionDefinitions, { argv, caseInsensitive: true });
  a.deepStrictEqual(result, {
    colour: ['red', 'green', 'blue']
  });
});

runner$b.test('case-insensitive: camelCase', function () {
  const optionDefinitions = [
    { name: 'dry-run', type: Boolean }
  ];
  const argv = ['--dry-RUN'];
  const result = commandLineArgs(optionDefinitions, { argv, camelCase: true, caseInsensitive: true });
  a.deepStrictEqual(result, {
    dryRun: true
  });
});

const runner$c = new TestRunner();

runner$c.test('defaultOption: multiple string', function () {
  const optionDefinitions = [
    { name: 'files', defaultOption: true, multiple: true }
  ];
  const argv = ['file1', 'file2'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    files: ['file1', 'file2']
  });
});

runner$c.test('defaultOption: after a boolean', function () {
  const definitions = [
    { name: 'one', type: Boolean },
    { name: 'two', defaultOption: true }
  ];
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--one', 'sfsgf'] }),
    { one: true, two: 'sfsgf' }
  );
});

runner$c.test('defaultOption: multiple-defaultOption values spread out', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'files', defaultOption: true, multiple: true }
  ];
  const argv = ['--one', '1', 'file1', 'file2', '--two', '2'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: '1',
    two: '2',
    files: ['file1', 'file2']
  });
});

runner$c.test('defaultOption: can be false', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: false },
    { name: 'two', defaultOption: false },
    { name: 'files', defaultOption: true, multiple: true }
  ];
  const argv = ['--one', '1', 'file1', 'file2', '--two', '2'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: '1',
    two: '2',
    files: ['file1', 'file2']
  });
});

runner$c.test('defaultOption: multiple-defaultOption values spread out 2', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean },
    { name: 'two' },
    { name: 'files', defaultOption: true, multiple: true }
  ];
  const argv = ['file0', '--one', 'file1', '--files', 'file2', '--two', '2', 'file3'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: true,
    two: '2',
    files: ['file0', 'file1', 'file2', 'file3']
  });
});

const runner$d = new TestRunner();

runner$d.test('default value', function () {
  const defs = [
    { name: 'one' },
    { name: 'two', defaultValue: 'two' }
  ];
  const argv = ['--one', '1'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    one: '1',
    two: 'two'
  });
});

runner$d.test('default value 2', function () {
  const defs = [{ name: 'two', defaultValue: 'two' }];
  const argv = [];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: 'two' });
});

runner$d.test('default value 3', function () {
  const defs = [{ name: 'two', defaultValue: 'two' }];
  const argv = ['--two', 'zwei'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: 'zwei' });
});

runner$d.test('default value 4', function () {
  const defs = [{ name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }];
  const argv = ['--two', 'duo'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: ['duo'] });
});

runner$d.test('default value 5', function () {
  const defs = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'] }
  ];
  const argv = [];
  const result = commandLineArgs(defs, { argv });
  a.deepStrictEqual(result, { two: ['two', 'zwei'] });
});

runner$d.test('default value: array as defaultOption', function () {
  const defs = [
    { name: 'two', multiple: true, defaultValue: ['two', 'zwei'], defaultOption: true }
  ];
  const argv = ['duo'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), { two: ['duo'] });
});

runner$d.test('default value: falsy default values', function () {
  const defs = [
    { name: 'one', defaultValue: 0 },
    { name: 'two', defaultValue: false }
  ];

  const argv = [];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    one: 0,
    two: false
  });
});

runner$d.test('default value: is arrayifed if multiple set', function () {
  const defs = [
    { name: 'one', defaultValue: 0, multiple: true }
  ];

  let argv = [];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    one: [0]
  });
  argv = ['--one', '2'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    one: ['2']
  });
});

runner$d.test('default value: combined with defaultOption', function () {
  const defs = [
    { name: 'path', defaultOption: true, defaultValue: './' }
  ];

  let argv = ['--path', 'test'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: 'test'
  });
  argv = ['test'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: 'test'
  });
  argv = [];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: './'
  });
});

runner$d.test('default value: combined with multiple and defaultOption', function () {
  const defs = [
    { name: 'path', multiple: true, defaultOption: true, defaultValue: './' }
  ];

  let argv = ['--path', 'test1', 'test2'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test1', 'test2']
  });
  argv = ['--path', 'test'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test']
  });
  argv = ['test1', 'test2'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test1', 'test2']
  });
  argv = ['test'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test']
  });
  argv = [];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['./']
  });
});

runner$d.test('default value: array default combined with multiple and defaultOption', function () {
  const defs = [
    { name: 'path', multiple: true, defaultOption: true, defaultValue: ['./'] }
  ];

  let argv = ['--path', 'test1', 'test2'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test1', 'test2']
  });
  argv = ['--path', 'test'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test']
  });
  argv = ['test1', 'test2'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test1', 'test2']
  });
  argv = ['test'];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['test']
  });
  argv = [];
  a.deepStrictEqual(commandLineArgs(defs, { argv }), {
    path: ['./']
  });
});

const runner$e = new TestRunner();

runner$e.test('detect process.argv: should automatically remove first two argv items', function () {
  process.argv = ['node', 'filename', '--one', 'eins'];
  a.deepStrictEqual(commandLineArgs({ name: 'one' }), {
    one: 'eins'
  });
});

runner$e.test('detect process.argv: should automatically remove first two argv items 2', function () {
  process.argv = ['node', 'filename', '--one', 'eins'];
  a.deepStrictEqual(commandLineArgs({ name: 'one' }, { argv: process.argv }), {
    one: 'eins'
  });
});

runner$e.test('process.argv is left untouched', function () {
  process.argv = ['node', 'filename', '--one', 'eins'];
  a.deepStrictEqual(commandLineArgs({ name: 'one' }), {
    one: 'eins'
  });
  a.deepStrictEqual(process.argv, ['node', 'filename', '--one', 'eins']);
});

const runner$f = new TestRunner();

runner$f.test('detect process.execArgv: should automatically remove first argv items', function () {
  const origArgv = process.argv;
  const origExecArgv = process.execArgv;
  process.argv = ['node', '--one', 'eins'];
  process.execArgv = ['-e', 'something'];
  a.deepStrictEqual(commandLineArgs({ name: 'one' }), {
    one: 'eins'
  });
  process.argv = origArgv;
  process.execArgv = origExecArgv;
});

const runner$g = new TestRunner();

runner$g.test('exceptions-already-set: long option', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ];
  const argv = ['--one', '--one'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'ALREADY_SET' && err.optionName === 'one'
  );
});

runner$g.test('exceptions-already-set: short option', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, alias: 'o' }
  ];
  const argv = ['--one', '-o'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'ALREADY_SET' && err.optionName === 'one'
  );
});

runner$g.test('exceptions-already-set: --option=value', function () {
  const optionDefinitions = [
    { name: 'one' }
  ];
  const argv = ['--one=1', '--one=1'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'ALREADY_SET' && err.optionName === 'one'
  );
});

runner$g.test('exceptions-already-set: combined short option', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, alias: 'o' }
  ];
  const argv = ['-oo'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'ALREADY_SET' && err.optionName === 'one'
  );
});

const runner$h = new TestRunner();

runner$h.test('err-invalid-definition: throws when no definition.name specified', function () {
  const optionDefinitions = [
    { something: 'one' },
    { something: 'two' }
  ];
  const argv = ['--one', '--two'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: throws if dev set a numeric alias', function () {
  const optionDefinitions = [
    { name: 'colours', alias: '1' }
  ];
  const argv = ['--colours', 'red'];

  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: throws if dev set an alias of "-"', function () {
  const optionDefinitions = [
    { name: 'colours', alias: '-' }
  ];
  const argv = ['--colours', 'red'];

  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: multi-character alias', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'aa' }
  ];
  const argv = ['--one', 'red'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: invalid type values 1', function () {
  const argv = ['--one', 'something'];
  a.throws(
    () => commandLineArgs([{ name: 'one', type: 'string' }], { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: invalid type values 2', function () {
  const argv = ['--one', 'something'];
  a.throws(
    () => commandLineArgs([{ name: 'one', type: 234 }], { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: invalid type values 3', function () {
  const argv = ['--one', 'something'];
  a.throws(
    () => commandLineArgs([{ name: 'one', type: {} }], { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: invalid type values 4', function () {
  const argv = ['--one', 'something'];
  a.doesNotThrow(function () {
    commandLineArgs([{ name: 'one', type: function () {} }], { argv });
  }, /invalid/i);
});

runner$h.test('err-invalid-definition: duplicate name', function () {
  const optionDefinitions = [
    { name: 'colours' },
    { name: 'colours' }
  ];
  const argv = ['--colours', 'red'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: duplicate name caused by case insensitivity', function () {
  const optionDefinitions = [
    { name: 'colours' },
    { name: 'coloURS' }
  ];
  const argv = ['--colours', 'red'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv, caseInsensitive: true }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: case sensitive names in different case', function () {
  const optionDefinitions = [
    { name: 'colours' },
    { name: 'coloURS' }
  ];
  const argv = ['--colours', 'red', '--coloURS', 'green'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    colours: 'red',
    coloURS: 'green'
  });
});

runner$h.test('err-invalid-definition: duplicate alias', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'a' },
    { name: 'two', alias: 'a' }
  ];
  const argv = ['--one', 'red'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: duplicate alias caused by case insensitivity', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'a' },
    { name: 'two', alias: 'A' }
  ];
  const argv = ['-a', 'red'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv, caseInsensitive: true }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: case sensitive aliases in different case', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'a' },
    { name: 'two', alias: 'A' }
  ];
  const argv = ['-a', 'red'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv }), {
    one: 'red'
  });
});

runner$h.test('err-invalid-definition: multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two', defaultOption: true }
  ];
  const argv = ['--one', 'red'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-definition: multiple defaultOptions 2', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: undefined },
    { name: 'two', defaultOption: false },
    { name: 'files', defaultOption: true, multiple: true },
    { name: 'files2', defaultOption: true }
  ];
  const argv = ['--one', '1', 'file1', 'file2', '--two', '2'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

runner$h.test('err-invalid-defaultOption: defaultOption on a Boolean type', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, defaultOption: true }
  ];
  const argv = ['--one', 'red'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'INVALID_DEFINITIONS'
  );
});

const runner$i = new TestRunner();

runner$i.test('exceptions-unknowns: unknown option', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['--one', '--two'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '--two'
  );
});

runner$i.test('exceptions-unknowns: 1 unknown option, 1 unknown value', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['--one', '2', '--two', 'two'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '--two'
  );
});

runner$i.test('exceptions-unknowns: unknown alias', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['-a', '2'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '-a'
  );
});

runner$i.test('exceptions-unknowns: unknown combined aliases', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv: ['-sdf'] }),
    err => err.name === 'UNKNOWN_OPTION' && err.optionName === '-s'
  );
});

runner$i.test('exceptions-unknowns: unknown value', function () {
  const optionDefinitions = [
    { name: 'one' }
  ];
  const argv = ['--one', 'arg1', 'arg2'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === 'arg2'
  );
});

runner$i.test('exceptions-unknowns: unknown value with singular defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true }
  ];
  const argv = ['arg1', 'arg2'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === 'arg2'
  );
});

runner$i.test('exceptions-unknowns: no unknown value exception with multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true, multiple: true }
  ];
  const argv = ['arg1', 'arg2'];
  a.doesNotThrow(() => {
    commandLineArgs(optionDefinitions, { argv });
  });
});

runner$i.test('exceptions-unknowns: non-multiple defaultOption should take first value 2', function () {
  const optionDefinitions = [
    { name: 'file', defaultOption: true },
    { name: 'one', type: Boolean },
    { name: 'two', type: Boolean }
  ];
  const argv = ['--two', 'file1', '--one', 'file2'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === 'file2'
  );
});

const runner$j = new TestRunner();

runner$j.test('groups', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three', group: 'b' }
  ];
  const argv = ['--one', '1', '--two', '2', '--three', '3'];
  const output = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(output, {
    a: {
      one: '1',
      two: '2'
    },
    b: {
      three: '3'
    },
    _all: {
      one: '1',
      two: '2',
      three: '3'
    }
  });
});

runner$j.test('groups: multiple and _none', function () {
  const definitions = [
    { name: 'one', group: ['a', 'f'] },
    { name: 'two', group: ['a', 'g'] },
    { name: 'three' }
  ];

  a.deepStrictEqual(commandLineArgs(definitions, { argv: ['--one', '1', '--two', '2', '--three', '3'] }), {
    a: {
      one: '1',
      two: '2'
    },
    f: {
      one: '1'
    },
    g: {
      two: '2'
    },
    _none: {
      three: '3'
    },
    _all: {
      one: '1',
      two: '2',
      three: '3'
    }
  });
});

runner$j.test('groups: nothing set', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three', group: 'b' }
  ];
  const argv = [];
  const output = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(output, {
    a: {},
    b: {},
    _all: {}
  });
});

runner$j.test('groups: nothing set with one ungrouped', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three' }
  ];
  const argv = [];
  const output = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(output, {
    a: {},
    _all: {}
  });
});

runner$j.test('groups: two ungrouped, one set', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three' },
    { name: 'four' }
  ];
  const argv = ['--three', '3'];
  const output = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(output, {
    a: {},
    _all: { three: '3' },
    _none: { three: '3' }
  });
});

runner$j.test('groups: two ungrouped, both set', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three' },
    { name: 'four' }
  ];
  const argv = ['--three', '3', '--four', '4'];
  const output = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(output, {
    a: {},
    _all: { three: '3', four: '4' },
    _none: { three: '3', four: '4' }
  });
});

runner$j.test('groups: with partial', function () {
  const definitions = [
    { name: 'one', group: 'a' },
    { name: 'two', group: 'a' },
    { name: 'three', group: 'b' }
  ];
  const argv = ['--one', '1', '--two', '2', '--three', '3', 'ham', '--cheese'];
  a.deepStrictEqual(commandLineArgs(definitions, { argv, partial: true }), {
    a: {
      one: '1',
      two: '2'
    },
    b: {
      three: '3'
    },
    _all: {
      one: '1',
      two: '2',
      three: '3'
    },
    _unknown: ['ham', '--cheese']
  });
});

runner$j.test('partial: with partial, multiple groups and _none', function () {
  const definitions = [
    { name: 'one', group: ['a', 'f'] },
    { name: 'two', group: ['a', 'g'] },
    { name: 'three' }
  ];
  const argv = ['--cheese', '--one', '1', 'ham', '--two', '2', '--three', '3', '-c'];
  a.deepStrictEqual(commandLineArgs(definitions, { argv, partial: true }), {
    a: {
      one: '1',
      two: '2'
    },
    f: {
      one: '1'
    },
    g: {
      two: '2'
    },
    _none: {
      three: '3'
    },
    _all: {
      one: '1',
      two: '2',
      three: '3'
    },
    _unknown: ['--cheese', 'ham', '-c']
  });
});

const runner$k = new TestRunner();

runner$k.test('lazy multiple: string', function () {
  const argv = ['--one', 'a', '--one', 'b', '--one', 'd'];
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['a', 'b', 'd']
  });
});

runner$k.test('lazy multiple: string unset with defaultValue', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true, defaultValue: 1 }
  ];
  const argv = [];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, { one: [1] });
});

runner$k.test('lazy multiple: string, --option=value', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ];
  const argv = ['--one=1', '--one=2'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['1', '2']
  });
});

runner$k.test('lazy multiple: string, --option=value mix', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ];
  const argv = ['--one=1', '--one=2', '--one', '3'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['1', '2', '3']
  });
});

runner$k.test('lazy multiple: string, defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true, defaultOption: true }
  ];
  const argv = ['1', '2'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['1', '2']
  });
});

runner$k.test('lazy multiple: greedy style, string', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ];
  const argv = ['--one', '1', '2'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === '2'
  );
});

runner$k.test('lazy multiple: greedy style, string, --option=value', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ];
  const argv = ['--one=1', '--one=2'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['1', '2']
  });
});

runner$k.test('lazy multiple: greedy style, string, --option=value mix', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ];
  const argv = ['--one=1', '--one=2', '3'];
  a.throws(
    () => commandLineArgs(optionDefinitions, { argv }),
    err => err.name === 'UNKNOWN_VALUE' && err.value === '3'
  );
});

const runner$l = new TestRunner();

runner$l.test('multiple: empty argv', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ];
  const argv = [];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {});
});

runner$l.test('multiple: boolean, empty argv', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean, multiple: true }
  ];
  const argv = [];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, { });
});

runner$l.test('multiple: string unset with defaultValue', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true, defaultValue: 1 }
  ];
  const argv = [];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, { one: [1] });
});

runner$l.test('multiple: string', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ];
  const argv = ['--one', '1', '2'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['1', '2']
  });
});

runner$l.test('multiple: string, --option=value', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ];
  const argv = ['--one=1', '--one=2'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['1', '2']
  });
});

runner$l.test('multiple: string, --option=value mix', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ];
  const argv = ['--one=1', '--one=2', '3'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['1', '2', '3']
  });
});

runner$l.test('multiple: string, defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true, defaultOption: true }
  ];
  const argv = ['1', '2'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    one: ['1', '2']
  });
});

const runner$m = new TestRunner();

runner$m.test('name-alias-mix: one of each', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' },
    { name: 'three', alias: 'h' },
    { name: 'four', alias: 'f' }
  ];
  const argv = ['--one', '-t', '--three'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.strictEqual(result.one, null);
  a.strictEqual(result.two, null);
  a.strictEqual(result.three, null);
  a.strictEqual(result.four, undefined);
});

const runner$n = new TestRunner();

runner$n.test('name-unicode: unicode names and aliases are permitted', function () {
  const optionDefinitions = [
    { name: 'один' },
    { name: '两' },
    { name: 'три', alias: 'т' }
  ];
  const argv = ['--один', '1', '--两', '2', '-т', '3'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.strictEqual(result.один, '1');
  a.strictEqual(result.两, '2');
  a.strictEqual(result.три, '3');
});

const runner$o = new TestRunner();

runner$o.test('--option=value notation: two plus a regular notation', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' },
    { name: 'three' }
  ];

  const argv = ['--one=1', '--two', '2', '--three=3'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.strictEqual(result.one, '1');
  a.strictEqual(result.two, '2');
  a.strictEqual(result.three, '3');
});

runner$o.test('--option=value notation: value contains "="', function () {
  const optionDefinitions = [
    { name: 'url' },
    { name: 'two' },
    { name: 'three' }
  ];

  let result = commandLineArgs(optionDefinitions, { argv: ['--url=my-url?q=123', '--two', '2', '--three=3'] });
  a.strictEqual(result.url, 'my-url?q=123');
  a.strictEqual(result.two, '2');
  a.strictEqual(result.three, '3');

  result = commandLineArgs(optionDefinitions, { argv: ['--url=my-url?q=123=1'] });
  a.strictEqual(result.url, 'my-url?q=123=1');

  result = commandLineArgs({ name: 'my-url' }, { argv: ['--my-url=my-url?q=123=1'] });
  a.strictEqual(result['my-url'], 'my-url?q=123=1');
});

const runner$p = new TestRunner();

runner$p.test('partial: simple', function () {
  const definitions = [
    { name: 'one', type: Boolean }
  ];
  const argv = ['--two', 'two', '--one', 'two'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    one: true,
    _unknown: ['--two', 'two', 'two']
  });
});

runner$p.test('partial: defaultOption', function () {
  const definitions = [
    { name: 'files', type: String, defaultOption: true, multiple: true }
  ];
  const argv = ['--files', 'file1', '--one', 'file2'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    files: ['file1', 'file2'],
    _unknown: ['--one']
  });
});

runner$p.test('defaultOption: floating args present but no defaultOption', function () {
  const definitions = [
    { name: 'one', type: Boolean }
  ];
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['aaa', '--one', 'aaa', 'aaa'], partial: true }),
    {
      one: true,
      _unknown: ['aaa', 'aaa', 'aaa']
    }
  );
});

runner$p.test('partial: combined short option, both unknown', function () {
  const definitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' }
  ];
  const argv = ['-ab'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    _unknown: ['-a', '-b']
  });
});

runner$p.test('partial: combined short option, one known, one unknown', function () {
  const definitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' }
  ];
  const argv = ['-ob'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    one: null,
    _unknown: ['-b']
  });
});

runner$p.test('partial: defaultOption with --option=value and combined short options', function () {
  const definitions = [
    { name: 'files', type: String, defaultOption: true, multiple: true },
    { name: 'one', type: Boolean },
    { name: 'two', alias: 't', defaultValue: 2 }
  ];
  const argv = ['file1', '--one', 'file2', '-t', '--two=3', 'file3', '-ab'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    files: ['file1', 'file2', 'file3'],
    two: '3',
    one: true,
    _unknown: ['-a', '-b']
  });
});

runner$p.test('partial: defaultOption with value equal to defaultValue', function () {
  const definitions = [
    { name: 'file', type: String, defaultOption: true, defaultValue: 'file1' }
  ];
  const argv = ['file1', '--two=3', '--four', '5'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    file: 'file1',
    _unknown: ['--two=3', '--four', '5']
  });
});

runner$p.test('partial: string defaultOption can be set by argv once', function () {
  const definitions = [
    { name: 'file', type: String, defaultOption: true, defaultValue: 'file1' }
  ];
  const argv = ['--file', '--file=file2', '--two=3', '--four', '5'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    file: 'file2',
    _unknown: ['--two=3', '--four', '5']
  });
});

runner$p.test('partial: string defaultOption can not be set by argv twice', function () {
  const definitions = [
    { name: 'file', type: String, defaultOption: true, defaultValue: 'file1' }
  ];
  const argv = ['--file', '--file=file2', '--two=3', '--four', '5', 'file3'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    file: 'file2',
    _unknown: ['--two=3', '--four', '5', 'file3']
  });
});

runner$p.test('partial: defaultOption with value equal to defaultValue 3', function () {
  const definitions = [
    { name: 'file', type: String, defaultOption: true, defaultValue: 'file1' }
  ];
  const argv = ['file1', 'file2', '--two=3', '--four', '5'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    file: 'file1',
    _unknown: ['file2', '--two=3', '--four', '5']
  });
});

runner$p.test('partial: multiple', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true }
  ];
  const argv = ['file1', '--files', 'file2', '-t', '--two=3', 'file3', '-ab', '--files=file4'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    files: ['file2', 'file4'],
    _unknown: ['file1', '-t', '--two=3', 'file3', '-a', '-b']
  });
});

runner$p.test('unknown options: rejected defaultOption values end up in _unknown', function () {
  const definitions = [
    { name: 'foo', type: String },
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'libs', type: String, defaultOption: true }
  ];
  const argv = ['--foo', 'bar', '-v', 'libfn', '--libarg', 'val1', '-r'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    foo: 'bar',
    verbose: true,
    libs: 'libfn',
    _unknown: ['--libarg', 'val1', '-r']
  });
});

runner$p.test('partial: defaultOption with --option=value notation', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true, defaultOption: true }
  ];
  const argv = ['file1', 'file2', '--unknown=something'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    files: ['file1', 'file2'],
    _unknown: ['--unknown=something']
  });
});

runner$p.test('partial: defaultOption with --option=value notation 2', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true, defaultOption: true }
  ];
  const argv = ['file1', 'file2', '--unknown=something', '--files', 'file3', '--files=file4'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    files: ['file1', 'file2', 'file3', 'file4'],
    _unknown: ['--unknown=something']
  });
});

runner$p.test('partial: defaultOption with --option=value notation 3', function () {
  const definitions = [
    { name: 'files', type: String, multiple: true, defaultOption: true }
  ];
  const argv = ['--unknown', 'file1', '--another', 'something', 'file2', '--unknown=something', '--files', 'file3', '--files=file4'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    files: ['file1', 'something', 'file2', 'file3', 'file4'],
    _unknown: ['--unknown', '--another', '--unknown=something']
  });
});

runner$p.test('partial: mulitple unknowns with same name', function () {
  const definitions = [
    { name: 'file' }
  ];
  const argv = ['--unknown', '--unknown=something', '--file=file1', '--unknown'];
  const options = commandLineArgs(definitions, { argv, partial: true });
  a.deepStrictEqual(options, {
    file: 'file1',
    _unknown: ['--unknown', '--unknown=something', '--unknown']
  });
});

runner$p.test('defaultOption: single string', function () {
  const optionDefinitions = [
    { name: 'files', defaultOption: true }
  ];
  const argv = ['file1', 'file2'];
  a.deepStrictEqual(commandLineArgs(optionDefinitions, { argv, partial: true }), {
    files: 'file1',
    _unknown: ['file2']
  });
});

const runner$q = new TestRunner();

runner$q.test('stopAtFirstUnknown', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean },
    { name: 'two', type: Boolean }
  ];
  const argv = ['--one', 'a', '--two'];
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true, partial: true });
  a.deepStrictEqual(result, {
    one: true,
    _unknown: ['a', '--two']
  });
});

runner$q.test('stopAtFirstUnknown: with a singlular defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ];
  const argv = ['--one', '1', '--', '--two', '2'];
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true });
  a.deepStrictEqual(result, {
    one: '1',
    _unknown: ['--', '--two', '2']
  });
});

runner$q.test('stopAtFirstUnknown: with a singlular defaultOption and partial', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ];
  const argv = ['--one', '1', '--', '--two', '2'];
  const result = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true, partial: true });
  a.deepStrictEqual(result, {
    one: '1',
    _unknown: ['--', '--two', '2']
  });
});

const runner$r = new TestRunner();

runner$r.test('type-boolean: simple', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ];

  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one'] }),
    { one: true }
  );
});

const origBoolean$1 = Boolean;

/* test in contexts which override the standard global Boolean constructor */
runner$r.test('type-boolean: global Boolean overridden', function () {
  function Boolean () {
    return origBoolean$1.apply(origBoolean$1, arguments)
  }

  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ];

  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one'] }),
    { one: true }
  );
});

runner$r.test('type-boolean-multiple: 1', function () {
  const optionDefinitions = [
    { name: 'array', type: Boolean, multiple: true }
  ];
  const argv = ['--array', '--array', '--array'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    array: [true, true, true]
  });
});

const runner$s = new TestRunner();

const definitions = [
  { name: 'one' },
  { name: 'two' }
];

runner$s.test('name: no argv values', function () {
  const argv = [];
  const result = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(result, {});
});

runner$s.test('name: just names, no values', function () {
  const argv = ['--one', '--two'];
  const result = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(result, {
    one: null,
    two: null
  });
});

runner$s.test('name: just names, one value, one unpassed value', function () {
  const argv = ['--one', 'one', '--two'];
  const result = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(result, {
    one: 'one',
    two: null
  });
});

runner$s.test('name: just names, two values', function () {
  const argv = ['--one', 'one', '--two', 'two'];
  const result = commandLineArgs(definitions, { argv });
  a.deepStrictEqual(result, {
    one: 'one',
    two: 'two'
  });
});

const runner$t = new TestRunner();

runner$t.test('type-number: different values', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ];
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', '1'] }),
    { one: 1 }
  );
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one'] }),
    { one: null }
  );
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', '-1'] }),
    { one: -1 }
  );
  const result = commandLineArgs(optionDefinitions, { argv: ['--one', 'asdf'] });
  a.ok(isNaN(result.one));
});

runner$t.test('number multiple: 1', function () {
  const optionDefinitions = [
    { name: 'array', type: Number, multiple: true }
  ];
  const argv = ['--array', '1', '2', '3'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    array: [1, 2, 3]
  });
  a.notDeepStrictEqual(result, {
    array: ['1', '2', '3']
  });
});

runner$t.test('number multiple: 2', function () {
  const optionDefinitions = [
    { name: 'array', type: Number, multiple: true }
  ];
  const argv = ['--array', '1', '--array', '2', '--array', '3'];
  const result = commandLineArgs(optionDefinitions, { argv });
  a.deepStrictEqual(result, {
    array: [1, 2, 3]
  });
  a.notDeepStrictEqual(result, {
    array: ['1', '2', '3']
  });
});

const runner$u = new TestRunner();

runner$u.test('type-other: different values', function () {
  const definitions = [
    {
      name: 'file',
      type: function (file) {
        return file
      }
    }
  ];

  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file', 'one.js'] }),
    { file: 'one.js' }
  );
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file'] }),
    { file: null }
  );
});

runner$u.test('type-other: broken custom type function', function () {
  const definitions = [
    {
      name: 'file',
      type: function (file) {
        throw new Error('broken')
      }
    }
  ];
  a.throws(function () {
    commandLineArgs(definitions, { argv: ['--file', 'one.js'] });
  });
});

runner$u.test('type-other-multiple: different values', function () {
  const definitions = [
    {
      name: 'file',
      multiple: true,
      type: function (file) {
        return file
      }
    }
  ];

  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file', 'one.js'] }),
    { file: ['one.js'] }
  );
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file', 'one.js', 'two.js'] }),
    { file: ['one.js', 'two.js'] }
  );
  a.deepStrictEqual(
    commandLineArgs(definitions, { argv: ['--file'] }),
    { file: [] }
  );
});

const runner$v = new TestRunner();

runner$v.test('type-string: different values', function () {
  const optionDefinitions = [
    { name: 'one', type: String }
  ];
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', 'yeah'] }),
    { one: 'yeah' }
  );
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one'] }),
    { one: null }
  );
  a.deepStrictEqual(
    commandLineArgs(optionDefinitions, { argv: ['--one', '3'] }),
    { one: '3' }
  );
});
