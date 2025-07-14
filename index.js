import { fromTo, single, positional } from './lib/from-to.js'

/* TODO: factor out into a FromTo Extractor-derived class as relevant only to from-to. */
const toPresets = {
  singleOptionValue (arg, index, argv, valueIndex) {
    return valueIndex > 1 || arg.startsWith('--')
  },

  multipleOptionValue (arg, index, argv, valueIndex) {
    return arg.startsWith('--')
  }
}

class CommandLineArgs {
  constructor (argv) {
    if (argv) {
      this.argv = argv.slice()
    } else {
      this.argv = process.argv.slice(2)
    }
    this.origArgv = this.argv.slice()
  }

  /**
   * @param {OptionDefinition[]}
   */
  parse (optionDefinitions) {
    const result = {}

    const notPositionals = optionDefinitions.filter(d => d.extractor !== 'positional')
    for (const def of notPositionals) {
      let extraction
      if (def.extractor === 'fromTo') {
        extraction = fromTo(this.argv, {
          from: def.from,
          to: toPresets[def.to],
          remove: true
        })
      } else if (def.extractor === 'single') {
        extraction = single(this.argv, def.single, { remove: true })
      } else {
        throw new Error('Extractor not found: ' + def.extractor)
      }
      if (extraction.length) {
        result[def.name] = def.output(extraction)
      }
    }

    /* Do the positionals backwards, so removing them doesn't mess up the position config */
    /* TODO: factor this behaviour out into a specialised Extractor derived Positional class. Remove hard-coded logic switches like 'positional', logic & behaviour should be passed in. */
    /* TODO: Need a "pre-processing" step for Extractor-specific steps like changing the sort order */
    /* TODO: Should positionals be processed last to avoid extracting fromTo or single definitions (e.g. --option value) */
    const positionals = optionDefinitions.filter(d => d.extractor === 'positional')
    positionals.sort((a, b) => b.position - a.position)

    if (positionals.length) {
      for (const def of positionals) {
        const extraction = positional(this.argv, def.position - 1, { remove: true })
        if (extraction.length) {
          result[def.name] = def.output(extraction)
        }
      }
    }

    return result
  }
}

export default CommandLineArgs
