'use strict';

/**
 * Similar to find-replace with two exceptions:
 * - fromTo finds multiple items, find-replace finds single items
 * - fromTo offers the option to remove, find-replace offers option to remove and/or replace.
 *
 * Scenarios you can perform
 * - Find one or more items and return (all return values are arrays)
 * - Find one or more items, return them, remove them from the input array
 *
 * [options.rtol] {boolean} - Enable right-to-left scans. Either that or pass in a custom iterator.
 * [options.remove] {boolean} - Remove from source array
 * [options.from] {boolean}
 * [options.to] {boolean}
 * @returns string[]
 */
function fromTo (arr, options = {}) {
  const { from: fromFn, to: toFn, remove } = options;
  const fromIndex = arr.findIndex(fromFn);
  let toIndex;
  if (toFn) {
    toIndex = arr.findIndex((item, index, arr) => {
      if ((index > fromIndex) && toFn) {
        const valueIndex = index - fromIndex;
        return toFn(valueIndex, item, index, arr)
      } else {
        return false
      }
    });
  } else {
    toIndex = fromIndex;
  }
  if (remove) {
    return arr.splice(fromIndex, toIndex === -1 ? 1 : toIndex - fromIndex + 1)
  } else {
    // return arr.slice(fromIndex, toIndex + 1)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    return arr.slice(fromIndex, toIndex === -1 ? 1 : toIndex - fromIndex + 1)
  }
}

/* TODO: add `noFurtherThan` function as an alternative, or replacement, for `to`.. Might result in easier code, e.g. "no further than a --option", rather than "stop here if the next item is an option or the end" */

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
