class CommandLineArgs {
  constructor (args, optionDefinitions) {
    this.args = args
    this.optionDefinitions = optionDefinitions
  }

  fromIndex (input, from) {
    return input.findIndex(from)
  }

  toIndex (input, to, fromIndex) {
    return input.findIndex((arg, index, arr) => {
      if ((index > fromIndex) && to) {
        const valueIndex = index - fromIndex
        return to(valueIndex, arg, index, arr)
      }
    })
  }

  extract (input, fromIndex, toIndex) {
    return input.splice(fromIndex, toIndex === -1 ? 1 : toIndex - fromIndex + 1)
  }

  parse () {
    const extractions = Array.from(this.extractions())
    const matches = Array.from(this.matches(extractions))
    return this.buildOutput(matches)
  }

  * matches (extractions) {
    for (const extraction of extractions) {
      const def = this.optionDefinitions.find(def => def.from(extraction[0]))
      let dynamicDef
      if (def.def) {
        dynamicDef = def.def(extraction[0])
        Object.assign(dynamicDef, def)
      } else {
        dynamicDef = def
      }
      const name = typeof dynamicDef.name === 'string' ? dynamicDef.name : dynamicDef.name(extraction)
      const typeResult = dynamicDef.type ? dynamicDef.type(extraction.slice(1)) : extraction.slice(1)
      yield [name, typeResult]
    }
  }

  * extractions () {
    for (const def of this.optionDefinitions) {
      let scanning = true
      while (scanning) {
        const fromIndex = this.fromIndex(this.args, def.from)
        if (fromIndex === -1) {
          scanning = false
        } else {
          let dynamicDef
          if (def.def) {
            dynamicDef = def.def(this.args[fromIndex])
            Object.assign(dynamicDef, def)
          } else {
            dynamicDef = def
          }
          const toIndex = dynamicDef.to ? this.toIndex(this.args, dynamicDef.to, fromIndex) : fromIndex
          yield this.extract(this.args, fromIndex, toIndex)
        }
      }
    }
  }

  buildOutput (matches) {
    const output = {}
    for (const [name, values] of matches) {
      output[name] = values
    }
    return output
  }
}

export default CommandLineArgs
