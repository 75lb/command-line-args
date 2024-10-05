import fromTo from './lib/from-to.js'

class CommandLineArgs {
  constructor (args, optionDefinitions) {
    this.origArgv = args.slice()
    this.args = args.slice()
    this.optionDefinitions = optionDefinitions
  }

  parse () {
    const extractions = this.getExtractions()
    const matches = this.getMatches(extractions)
    return this.buildOutput(matches)
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
        const fromIndex = this.args.findIndex(def.from)
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
          result.push(fromTo(this.args, {
            from: dynamicDef.from,
            to: dynamicDef.to,
            noFurtherThan: dynamicDef.noFurtherThan,
            remove: true
          }))
        }
      }
    }
    return result
  }

  /**
   * Operates on the extractions, input args not touched. Map an option to one or more values. Currently does some processing if `name` and/or `type` are provided. What if they are not, what should the defaults be?
   * Uses `def.from` to match with the first arg of the extraction (as the same def.from was originally used to create the extraction)
   * Uses def.def, def.name, def.type. Not def.to.
   * Output:
   [
     [<name>, [...typeResults]]
     [<name>, [...typeResults]]
   ]
   */
  getMatches (extractions) {
    const result = []
    for (const extraction of extractions) {
      /* the from arg is the one matched by def.from()  */
      const fromArg = extraction[0]
      const def = this.optionDefinitions.find(def => def.from(fromArg))
      let dynamicDef = def
      if (def.def) {
        dynamicDef = def.def(fromArg)
        Object.assign(dynamicDef, def)
      }
      const name = dynamicDef.name === undefined
        ? fromArg
        : typeof dynamicDef.name === 'string'
          ? dynamicDef.name
          : dynamicDef.name(extraction)
      const typeResult = dynamicDef.type ? dynamicDef.type(extraction.slice(1)) : extraction.slice(1)
      result.push([name, typeResult])
    }
    return result
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
