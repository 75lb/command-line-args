const _value = new WeakMap()
const arrayify = require('array-back')
const t = require('typical')
const Definition = require('./definition')

class Option {
  constructor (definition) {
    this.definition = new Definition(definition)
    this.valueSource = null /* unknown, argv or default */
    this.resetToDefault()
  }
  get () {
    return _value.get(this)
  }

  /**
   * @throws 'already_set'
   */
  set (val) {
    if (this.definition.name === '_unknown') {
      this._setUnknown(val)
    } else {
      /* only set a non-mulitple defaultValue once.. */
      if (this.definition.defaultOption && !this.definition.multiple && this.valueSource === 'argv') {
        const err = new Error('non-mulitple defaultValue already set')
        err.name = 'already_set'
        throw err
      } else {
        this._set(val, 'argv')
      }
    }
  }

  _setUnknown (val) {
    this._set(val, 'unknown')
  }

  _set (val, source) {
    if (this.definition.multiple) {
      /* don't add null or undefined to a multiple */
      if (val !== null && val !== undefined) {
        const arr = this.get()
        if (this.valueSource === 'default') arr.length = 0
        arr.push(this.definition.type(val))
        this.valueSource = source
      }
    } else {
      if (val === null || val === undefined) {
        _value.set(this, val)
        /* required to make 'partial: defaultOption with value equal to defaultValue 2' pass */
        if (!(this.definition.defaultOption && !this.definition.multiple)) {
          this.valueSource = source
        }
      } else {
        _value.set(this, this.definition.type(val))
        this.valueSource = source
      }
    }
  }

  resetToDefault () {
    if (t.isDefined(this.definition.defaultValue)) {
      if (this.definition.multiple) {
        _value.set(this, arrayify(this.definition.defaultValue).slice())
      } else {
        _value.set(this, this.definition.defaultValue)
      }
    } else {
      if (this.definition.multiple) {
        _value.set(this, [])
      } else {
        _value.set(this, null)
      }
    }
    this.valueSource = 'default'
  }

  static create (definition) {
    definition = new Definition(definition)
    if (definition.isBoolean()) {
      return require('./flag-option').create(definition)
    } else {
      return new this(definition)
    }
  }
}

module.exports = Option
