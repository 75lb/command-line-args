class CommandLineArgs {
  constructor (args, optionDefinitions) {
    this.origArgv = args.slice()
    this.args = args.slice()
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
    const extractions = this.getExtractions()
    const matches = this.getMatches(extractions)
    return this.buildOutput(matches)
  }

  /**
   * Operates on the extractions, input args not touched. Map an option to one or more values. Currently does some processing if `name` and/or `type` are provided. What if they are not, what should the defaults be?
   * Uses `def.from` to match with the first arg of the extraction (as the same def.from was originally used to create the extraction)
   * Uses def.def, def.name, def.type. Not def.to.
   * Output:
   [
     [<name-result>, [...typeResults]]
     [<name-result>, [...typeResults]]
   ]
   */
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

  /**
   * Loop through the defs using `def.from` and `def.to` to compute `args` start and end indices for extraction.
   * Output:
   * [<from-arg>, <...arg>, <to-arg>]
   */
  getExtractions () {
    const result = []
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
          result.push(this.extract(this.args, fromIndex, toIndex))
        }
      }
    }
    return result
  }

  getMatches (extractions) {
    return Array.from(this.matches(extractions))
  }

  /**
   * No hints or config in the def. User decides, hand-rolled preference.
   */
  buildOutput (matches) {
    const output = {}
    for (const [name, values] of matches) {
      output[name] = values
    }
    return output
  }
}

export default CommandLineArgs
