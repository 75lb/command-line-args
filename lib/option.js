'use strict'
const _value = new WeakMap()
const arrayify = require('array-back')
const t = require('typical')
const Definition = require('./definition')

/**
 * Encapsulates behaviour (defined by an OptionDefinition) when setting values
 */
class Option {
  constructor (definition) {
    this.definition = new Definition(definition)
    this.state = null /* set or default */
    this.resetToDefault()
  }

  get () {
    return _value.get(this)
  }

  set (val) {
    this._set(val, 'set')
  }

  _set (val, state) {
    const def = this.definition
    if (def.multiple || def.lazyMultiple) {
      /* don't add null or undefined to a multiple */
      if (val !== null && val !== undefined) {
        const arr = this.get()
        if (this.state === 'default') arr.length = 0
        arr.push(def.type(val))
        this.state = state
      }
    } else {

      /* throw if already set on a singlar defaultOption */
      if (def.defaultOption && !def.multiple && this.state === 'set') {
        const err = new Error('Singular defaultOption already set with: ' + this.get())
        err.name = 'ALREADY_SET'
        err.value = val
        throw err
      } else if (val === null || val === undefined) {
        _value.set(this, val)
        /* required to make 'partial: defaultOption with value equal to defaultValue 2' pass */
        if (!(def.defaultOption && !def.multiple)) {
          this.state = state
        }
      } else {
        _value.set(this, def.type(val))
        this.state = state
      }
    }
  }

  resetToDefault () {
    if (t.isDefined(this.definition.defaultValue)) {
      if (this.definition.isMultiple()) {
        _value.set(this, arrayify(this.definition.defaultValue).slice())
      } else {
        _value.set(this, this.definition.defaultValue)
      }
    } else {
      if (this.definition.isMultiple()) {
        _value.set(this, [])
      } else {
        _value.set(this, null)
      }
    }
    this.state = 'default'
  }

  static create (definition) {
    definition = new Definition(definition)
    if (definition.isBoolean()) {
      return require('./option-flag').create(definition)
    } else {
      return new this(definition)
    }
  }
}

module.exports = Option
