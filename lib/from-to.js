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
  const { from: fromFn, to: toFn, remove } = options
  const fromIndex = arr.findIndex(fromFn)
  let toIndex
  if (toFn) {
    toIndex = arr.findIndex((item, index, arr) => {
      if ((index > fromIndex) && toFn) {
        const valueIndex = index - fromIndex
        return toFn(valueIndex, item, index, arr)
      } else {
        return false
      }
    })
  } else {
    toIndex = fromIndex
  }
  if (remove) {
    return arr.splice(fromIndex, toIndex === -1 ? 1 : toIndex - fromIndex + 1)
  } else {
    // return arr.slice(fromIndex, toIndex + 1)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    return arr.slice(fromIndex, toIndex === -1 ? 1 : toIndex - fromIndex + 1)
  }
}

export default fromTo
