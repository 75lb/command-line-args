import arrayBack from 'array-back'

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
  let { from, to: toFn, remove } = options

  const fromIndex = getFromIndex(arr, from)

  toFn = arrayBack(toFn).map(convertToFunction)
  let toIndex = -1
  if (toFn.length) {
    for (const fn of toFn) {
      toIndex = arr.findIndex((item, index, arr) => {
        if (index > fromIndex) {
          const valueIndex = index - fromIndex
          return fn(item, index, arr, valueIndex)
        } else {
          return false
        }
      })
      /* Keep looping until a match is found. */
      if (toIndex > -1) {
        break
      }
    }
  }

  const output = toIndex === -1
    ? arr.slice(fromIndex) /* Return all to the end */
    : arr.slice(fromIndex, toIndex)

  if (options.remove) {
    if (toIndex === -1) {
      arr.splice(fromIndex)
    } else {
      arr.splice(fromIndex, toIndex - fromIndex)
    }
  }

  return output
}

function convertToFunction (fn) {
  if (typeof fn === 'string') {
    return function (val) { return val === fn }
  } else {
    return fn
  }
}

function getFromIndex (arr, find) {
  const fromFns = arrayBack(find).map(convertToFunction)

  if (fromFns.length === 0) {
    throw new Error('from required')
  }

  let fromIndex
  for (const fn of fromFns) {
    fromIndex = arr.findIndex(fn)
    if (fromIndex > -1) {
      break
    }
  }

  return fromIndex
}

function single (arr, item, options = {}) {
  const fromIndex = getFromIndex(arr, item)

  const output = arr.slice(fromIndex, fromIndex + 1)
  if (options.remove) {
    arr.splice(fromIndex, 1)
  }
  return output
}

export { fromTo, single }
