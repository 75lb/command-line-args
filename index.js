import { fromTo, single, positional } from './lib/from-to.js'

async function defaultOutput (val) { return val }

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

  async parse (optionDefinitions) {
    const result = {}

    const notPositionals = optionDefinitions.filter(d => d.extractor !== 'positional')
    for (const def of notPositionals) {
      def.output ||= defaultOutput
      let extraction
      if (def.extractor === 'fromTo') {
        const to = def.toPreset ? toPresets[def.toPreset] : def.to
        if (def.repeatable) {
          extraction = []
          let keepGoing = true
          while (keepGoing) {
            const argLength = this.argv.length
            const extractionStep = fromTo(this.argv, { from: def.from, to, remove: true })
            if (extractionStep.length) {
              extraction.push(extractionStep)
            }
            keepGoing = argLength !== this.argv.length
          }
        } else {
          extraction = fromTo(this.argv, { from: def.from, to, remove: true })
        }
        result[def.name] = await def.output(extraction)

      } else if (def.extractor === 'single') {
        if (def.repeatable) {
          extraction = []
          let keepGoing = true
          while (keepGoing) {
            const argLength = this.argv.length
            const extractionStep = single(this.argv, def.single, { remove: true })
            if (extractionStep.length) {
              extraction.push(extractionStep)
            }
            keepGoing = argLength !== this.argv.length
          }
        } else {
          extraction = single(this.argv, def.single, { remove: true })
        }
        const output = await def.output(extraction)
        if (output !== undefined) {
          result[def.name] = output
        }
      } else {
        throw new Error('Extractor not found: ' + def.extractor)
      }
    }

    /* Do the positionals backwards, so removing them doesn't mess up the position config */
    const positionals = optionDefinitions.filter(d => d.extractor === 'positional')
    positionals.sort((a, b) => b.position - a.position)

    if (positionals.length) {
      for (const def of positionals) {
        def.output ||= defaultOutput
        const extraction = positional(this.argv, def.position - 1, { remove: true })
        result[def.name] = await def.output(extraction)
      }
    }

    return result
  }
}

export default CommandLineArgs
