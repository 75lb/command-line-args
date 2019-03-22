import arrayify from '../node_modules/array-back/index.mjs'

/**
 * Find and either replace or remove items from an array.
 *
 * @module find-replace
 * @example
 * > findReplace = require('find-replace')
 *
 * > findReplace([ 1, 2, 3], 2, 'two')
 * [ 1, 'two', 3 ]
 *
 * > findReplace([ 1, 2, 3], 2, [ 'two', 'zwei' ])
 * [ 1, [ 'two', 'zwei' ], 3 ]
 *
 * > findReplace([ 1, 2, 3], 2, 'two', 'zwei')
 * [ 1, 'two', 'zwei', 3 ]
 *
 * > findReplace([ 1, 2, 3], 2) // no replacement, so remove
 * [ 1, 3 ]
 */

/**
 * @param {array} - the input array
 * @param {testFn} - a [test-value](https://github.com/75lb/test-value) query to match the value you're looking for
 * @param [replaceWith] {...any} - If specified, found values will be replaced with these values, else  removed.
 * @returns {array}
 * @alias module:find-replace
 */
function findReplace (array, testFn) {
  const found = []
  const replaceWiths = arrayify(arguments)
  replaceWiths.splice(0, 2)

  arrayify(array).forEach((value, index) => {
    let expanded = []
    replaceWiths.forEach(replaceWith => {
      if (typeof replaceWith === 'function') {
        expanded = expanded.concat(replaceWith(value))
      } else {
        expanded.push(replaceWith)
      }
    })

    if (testFn(value)) {
      found.push({
        index: index,
        replaceWithValue: expanded
      })
    }
  })

  found.reverse().forEach(item => {
    const spliceArgs = [ item.index, 1 ].concat(item.replaceWithValue)
    array.splice.apply(array, spliceArgs)
  })

  return array
}

export default findReplace
