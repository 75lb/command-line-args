import { fromTo, single, positional } from './lib/from-to.js'

const toPresets = {
  singleOptionValue (arg, index, argv, valueIndex) {
    return valueIndex > 1 || arg.startsWith('--')
  },

  multipleOptionValue (arg, index, argv, valueIndex) {
    return arg.startsWith('--')
  }
}

class CommandLineArgs {
  constructor (argv = process.argv) {
    this.origArgv = argv.slice()
    this.argv = argv.slice()
  }

  parse (optionDefinitions) {
    const result = {}

    /* Do the positionals backwards, so removing them doesn't mess up the position config */
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

    return result
  }
}

export default CommandLineArgs
