'use strict'
var arrayify = require('array-back')
var option = require('./option')
var Definition = require('./definition')
var t = require('typical')

/**
 * @class
 * @alias module:definitions
 */
class Definitions extends Array {
  constructor (definitions) {
    super()
    arrayify(definitions).forEach(def => this.push(new Definition(def)))
  }

  /**
   * validate option definitions
   * @returns {string}
   */
  validate (argv) {
    var someHaveNoName = this.some(def => !def.name)
    if (someHaveNoName) {
      return 'Invalid option definitions: the `name` property is required on each definition'
    }

    var someDontHaveFunctionType = this.some(def => def.type && typeof def.type !== 'function')
    if (someDontHaveFunctionType) {
      return 'Invalid option definitions: the `type` property must be a setter fuction (default: `Boolean`)'
    }

    var invalidOption
    
    var optionWithoutDefinition = argv
      .filter(arg => option.isOption(arg))
      .some(arg => {
        if (this.get(arg) === undefined) {
          invalidOption = arg
          return true
        }
      })
    if (optionWithoutDefinition) {
      return 'Invalid option: ' + invalidOption
    }

    var numericAlias = this.some(def => {
      invalidOption = def
      return t.isNumber(def.alias)
    })
    if (numericAlias) {
      return 'Invalid option definition: to avoid ambiguity an alias cannot be numeric [--' + invalidOption.name + ' alias is -' + invalidOption.alias + ']'
    }

    var hypenAlias = this.some(def => {
      invalidOption = def
      return def.alias === '-'
    })
    if (hypenAlias) {
      return 'Invalid option definition: an alias cannot be "-"'
    }
  }

  createOutput () {
    var output = {}
    this.forEach(def => {
      if (t.isDefined(def.defaultValue)) output[def.name] = def.defaultValue
      if (Array.isArray(output[def.name])) {
        output[def.name]._initial = true
      }
    })
    return output
  }

  get (arg) {
    return option.short.test(arg)
      ? this.find(def => def.alias === option.short.name(arg))
      : this.find(def => def.name === option.long.name(arg))
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

}

function containsValidGroup (def) {
  return arrayify(def.group).some(function (group) {
    return group
  })
}

/**
@module definitions
@private
*/
module.exports = Definitions
