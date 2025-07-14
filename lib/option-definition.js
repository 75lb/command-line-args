/**
 * @property name
 * @property extractor - from-to, single or positional.
 * @property from - used by extractor 'from-to'
 * @property to - used by extractor 'from-to'
 * @property single - used by extractor 'single'
 * @property position - used by extractor 'positional', not zero-indexed, starts with 1.
 * @property output - a function to run on the final value
 */
class OptionDefinition {
  name
  from
  to
  single
  output
}

export default OptionDefinition
