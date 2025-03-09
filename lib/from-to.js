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
 * [options.inclusive] {boolean} - If `true` includes the to item.
 * [options.from] {string[]|function[]}
 * [options.to] {string[]|function[]} - A "Stop Here" function. Set one or more strings as the terminating arg. Or, from the function `fn(arg, index, argv, valueIndex)`, return true for the first arg that is out of range. Set `inclusive` to also include it.
 * [options.toInclude] {string[]|function[]} - From the function `fn(arg, index, argv, valueIndex)`, return true for the first arg that is out of range. Set `inclusive` to also include it.
 * [options.noFurtherThan] {function}
 * [options.toEnd] {boolean}
 * @returns string[]
 */
function fromTo (arr, options = {}) {
  let { from: fromFn, to: toFn, noFurtherThan, remove, inclusive, toEnd } = options

  if (inclusive === undefined && !noFurtherThan && toFn) {
    inclusive = true
  }
  toFn = toFn || noFurtherThan
  fromFn = arrayBack(fromFn).map(fn => {
    if (typeof fn === 'string') {
      return function (val) { return val === fn }
    } else {
      return fn
    }
  })

  if (fromFn.length === 0) {
    throw new Error('from required')
  }

  toFn = arrayBack(toFn).map(fn => {
    if (typeof fn === 'string') {
      return function (item) { return item === fn }
    } else {
      return fn
    }
  })

  let fromIndex
  for (const fn of fromFn) {
    fromIndex = arr.findIndex(fn)
    if (fromIndex > -1) {
      break
    }
  }

  let toIndex
  if (toFn) {
    for (const fn of toFn) {
      toIndex = arr.findIndex((item, index, arr) => {
        if (index > fromIndex) {
          const valueIndex = index - fromIndex
          return fn(item, index, arr, valueIndex)
        } else {
          return false
        }
      })
      if (toIndex > -1) {
        break
      }
    }
  }

  if (remove) {
    let deleteCount
    if (toEnd) {
      deleteCount = arr.length
    }
    if (toIndex === -1) {
      /* TODO: If to is not found, should it behave the same as "no to" (just return the from value)? Scanning to the end supports `--option value value` */
      deleteCount = arr.length
    } else if (toIndex === undefined) {
      /* When to is omitted, just pick the single value at the from index */
      /* This differs to arr.slice which slices to the end of the array if end is omitted */
      deleteCount = 1
    } else {
      if (inclusive) {
        deleteCount = toIndex - fromIndex
      } else {
        deleteCount = toIndex - fromIndex - 1
      }
    }
    return arr.splice(fromIndex, deleteCount)
    /* deleteCount: An integer indicating the number of elements in the array to remove from start. */
    /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice */
  } else {
    if (toEnd) {
      toIndex = arr.length + 1
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

export default fromTo
