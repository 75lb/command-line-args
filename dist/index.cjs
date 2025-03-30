'use strict';

var arrayBack = require('array-back');

/**
 * Similar to find-replace with two exceptions:
 * - fromTo finds multiple items, find-replace finds single items
 * - fromTo offers the option to remove, find-replace offers option to remove and/or replace.
 *
 * Scenarios you can perform
 * - Find one or more items and return (all return values are arrays)
 * - Find one or more items, return them, remove them from the input array
 *
 * arr {string[]} - Input array. Only mutated if `options.remove` is set.
 * [options.rtol] {boolean} - Enable right-to-left scans. Either that or pass in a custom iterator. TODO.
 * [options.remove] {boolean} - Remove from source array
 * [options.from] {string[]|function[]} - String literal or a [findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) callback function.
 * [options.to] {string[]|function[]} - A "Stop Here" function. Set one or more strings as the terminating arg. Or, from the function `fn(arg, index, argv, valueIndex)`, return true for the first arg that is out of range. Set `inclusive` to also include it. To will always search to the end of the input array.
 * @returns string[]
 */

/* TODO: rename to extractFromTo? Rename `options.remove` to `extract`. */
function fromTo (arr, options = {}) {
  const fromIndex = getFromIndex(arr, options.from);

  const toFn = arrayBack(options.to).map(convertToFunction);
  let toIndex = -1;
  if (toFn.length) {
    for (const fn of toFn) {
      toIndex = arr.findIndex((item, index, arr) => {
        if (index > fromIndex) {
          const valueIndex = index - fromIndex;
          return fn(item, index, arr, valueIndex)
        } else {
          return false
        }
      });
      /* Keep looping until a match is found. */
      if (toIndex > -1) {
        break
      }
    }
  }

  const output = toIndex === -1
    ? arr.slice(fromIndex) /* Return all to the end */
    : arr.slice(fromIndex, toIndex);

  if (options.remove) {
    if (toIndex === -1) {
      arr.splice(fromIndex);
    } else {
      arr.splice(fromIndex, toIndex - fromIndex);
    }
  }

  return output
}

function convertToFunction (fn) {
  if (typeof fn === 'string') {
    return function (val) { return val === fn }
  } else if (fn instanceof RegExp) {
    return function (val) { return fn.test(val) }
  } else {
    return fn
  }
}

/**
 * Find the first value which matches the supplied `find` definition (one or more string or functions).
 */
function getFromIndex (arr, find) {
  const fromFns = arrayBack(find).map(convertToFunction);

  if (fromFns.length === 0) {
    throw new Error('from required')
  }

  let fromIndex;
  for (const fn of fromFns) {
    fromIndex = arr.findIndex(fn);
    if (fromIndex > -1) {
      break
    }
  }

  return fromIndex
}

class CommandLineArgs {
  constructor (args, optionDefinitions) {
    this.origArgv = args.slice();
    this.args = args.slice();
    this.optionDefinitions = optionDefinitions;
  }

  parse () {
    const extractions = this.getExtractions();
    const matches = this.getMatches(extractions);
    return this.buildOutput(matches)
  }

  /**
   * Loop through the defs using `def.from` and `def.to` to compute `args` start and end indices for extraction.
   * Output:
   * [<from-arg>, <...arg>, <to-arg>]
   */
  getExtractions () {
    const result = [];
    for (const def of this.optionDefinitions) {
      let scanning = true;
      while (scanning) {
        const fromIndex = this.args.findIndex(def.from);
        if (fromIndex === -1) {
          scanning = false;
        } else {
          let dynamicDef;
          if (def.def) {
            dynamicDef = def.def(this.args[fromIndex]);
            Object.assign(dynamicDef, def);
          } else {
            dynamicDef = def;
          }
          result.push(fromTo(this.args, {
            from: dynamicDef.from,
            to: dynamicDef.to,
            noFurtherThan: dynamicDef.noFurtherThan,
            remove: true
          }));
        }
      }
    }
    return result
  }

  /**
   * Operates on the extractions, input args not touched. Map an option to one or more values. Currently does some processing if `name` and/or `type` are provided. What if they are not, what should the defaults be?
   * Uses `def.from` to match with the first arg of the extraction (as the same def.from was originally used to create the extraction)
   * Uses def.def, def.name, def.type. Not def.to.
   * Output:
   [
     [<name>, [...typeResults]]
     [<name>, [...typeResults]]
   ]
   */
  getMatches (extractions) {
    const result = [];
    for (const extraction of extractions) {
      /* the from arg is the one matched by def.from()  */
      const fromArg = extraction[0];
      const def = this.optionDefinitions.find(def => def.from(fromArg));
      let dynamicDef = def;
      if (def.def) {
        dynamicDef = def.def(fromArg);
        Object.assign(dynamicDef, def);
      }
      const name = dynamicDef.name === undefined
        ? fromArg
        : typeof dynamicDef.name === 'string'
          ? dynamicDef.name
          : dynamicDef.name(extraction);
      const typeResult = dynamicDef.type ? dynamicDef.type(extraction.slice(1)) : extraction.slice(1);
      result.push([name, typeResult]);
    }
    return result
  }

  /**
   * No hints or config in the def. User decides, hand-rolled preference.
   */
  buildOutput (matches) {
    const output = {};
    for (const [name, values] of matches) {
      output[name] = values;
    }
    return output
  }
}

module.exports = CommandLineArgs;
