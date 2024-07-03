import Output from './output.mjs'
import arrayify from '../node_modules/array-back/index.mjs'
import t from '../node_modules/typical/index.mjs'
import camelCase from 'lodash.camelcase'

class GroupedOutput extends Output {
  toObject (options) {
    const superOutputNoCamel = super.toObject({ skipUnknown: options.skipUnknown, skipInputs: true })
    const superOutput = super.toObject(options)
    const unknown = superOutput._unknown
    delete superOutput._unknown
    const inputs = superOutput._inputs
    delete superOutput._inputs
    const grouped = {
      _all: superOutput
    }
    if (unknown && unknown.length) grouped._unknown = unknown
    if (inputs && Object.keys(inputs).length) grouped._inputs = inputs

    this.definitions.whereGrouped().forEach(def => {
      const name = options.camelCase ? camelCase(def.name) : def.name
      const outputValue = superOutputNoCamel[def.name]
      for (const groupName of arrayify(def.group)) {
        grouped[groupName] = grouped[groupName] || {}
        if (t.isDefined(outputValue)) {
          grouped[groupName][name] = outputValue
        }
      }
    })

    this.definitions.whereNotGrouped().forEach(def => {
      const name = options.camelCase ? camelCase(def.name) : def.name
      const outputValue = superOutputNoCamel[def.name]
      if (t.isDefined(outputValue)) {
        if (!grouped._none) grouped._none = {}
        grouped._none[name] = outputValue
      }
    })
    return grouped
  }
}

export default GroupedOutput
