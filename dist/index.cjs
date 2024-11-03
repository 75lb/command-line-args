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
 * [options.rtol] {boolean} - Enable right-to-left scans. Either that or pass in a custom iterator.
 * [options.remove] {boolean} - Remove from source array
 * [options.inclusive] {boolean} - If `true` includes the to item.
 * [options.from] {function}
 * [options.to] {function}
 * [options.noFurtherThan] {function}
 * @returns string[]
 */
function fromTo (arr, options = {}) {
  let { from: fromFn, to: toFn, noFurtherThan, remove, inclusive, toEnd } = options;
  if (inclusive === undefined && !noFurtherThan && toFn) {
    inclusive = true;
  }
  toFn = toFn || noFurtherThan;
  fromFn = arrayBack(fromFn).map(fn => {
    if (typeof fn === 'string') {
      return function (val) { return val === fn }
    } else {
      return fn
    }
  });
  toFn = arrayBack(toFn).map(fn => {
    if (typeof fn === 'string') {
      return function (item, index, arr, valueIndex) { return item === fn }
    } else {
      return fn
    }
  });

  let fromIndex;
  for (const fn of fromFn) {
    fromIndex = arr.findIndex(fn);
    if (fromIndex > -1) {
      break
    }
  }

  let toIndex;
  if (toFn) {
    for (const fn of toFn) {
      toIndex = arr.findIndex((item, index, arr) => {
        if (index > fromIndex) {
          const valueIndex = index - fromIndex;
          return fn(item, index, arr, valueIndex)
        } else {
          return false
        }
      });
      if (toIndex > -1) {
        break
      }
    }
  }

  if (remove) {
    let deleteCount;
    if (toEnd) {
      deleteCount = arr.length;
    }
    if (toIndex === -1) {
      /* TODO: If to is not found, should it behave the same as "no to" (just return the from value)? Scanning to the end supports `--option value value` */
      deleteCount = arr.length;
    } else if (toIndex === undefined) {
      /* When to is omitted, just pick the single value at the from index */
      /* This differs to arr.slice which slices to the end of the array if end is omitted */
      deleteCount = 1;
    } else {
      if (inclusive) {
        deleteCount = toIndex - fromIndex;
      } else {
        deleteCount = toIndex - fromIndex - 1;
      }
    }
    return arr.splice(fromIndex, deleteCount)
    /* deleteCount: An integer indicating the number of elements in the array to remove from start. */
    /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice */
  } else {
    if (toEnd) {
      toIndex = arr.length + 1;
    }
    if (toIndex === -1) {
      return arr.slice(fromIndex)
    } else if (toIndex === undefined) {
      /* When to is omitted, just pick the single value at the from index */
      /* This differs to arr.slice which slices to the end of the array if end is omitted */
      return arr.slice(fromIndex, fromIndex + 1)
    } else {
      if (inclusive) {
        return arr.slice(fromIndex, toIndex + 1)
      } else {
        return arr.slice(fromIndex, toIndex)
      }
    }
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    /* End: Zero-based index at which to end extraction. slice() extracts up to but not including end. */
  }
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
