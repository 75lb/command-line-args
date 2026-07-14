/* ☭
## OptionDefinition

- **Type:** `class`

¬
  Property
  Description
¬
  name
  property name on the result
¬
  extractor
  Choose from `from-to`, `single` or `positional`.
¬
  from
  used by extractor 'from-to'
¬
  toPreset
  used by extractor 'from-to'
¬
  single
  used by extractor 'single'
¬
  position
  used by extractor 'positional', not zero-indexed, starts with 1.
¬
  output
  a function to cherry-pick the output value
¬
*/
class OptionDefinition {
  name
  from
  to
  single
  output // TODO: should this be named `value` as it is the output value.
}

export default OptionDefinition
