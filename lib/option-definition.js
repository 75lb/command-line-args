class OptionDefinition {
  name
  from
  to

  /**
   * An additional alternative, or replacement, for `to`. Might result in easier code, e.g. "no further than a --option", rather than "stop here if the next item is an option or the end". This is also how slice() works: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
   */
  noFurtherThan
  type
  def
}

export default OptionDefinition
