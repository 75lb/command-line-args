<a name="module_command-line-args"></a>

## command-line-args
<a name="exp_module_command-line-args--commandLineArgs"></a>

### commandLineArgs(optionDefinitions, [options]) ⇒ <code>object</code> ⏏
Returns an object containing all option values set on the command line. By default it parses the global  [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.

Parsing is strict by default, an exception is thrown if the user sets either an unknown option (one without a valid [definition](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md)) or value. To enable [partial parsing](https://github.com/75lb/command-line-args/wiki/Partial-mode-example), invoke `commandLineArgs` with the `partial` option - all unknown arguments will be returned in the `_unknown` property.

**Kind**: Exported function  
**Throws**:

- `UNKNOWN_OPTION` if `options.partial` is false and the user set an undefined option (stored at `err.optionName`)
- `INVALID_DEFINITIONS`
  - If an option definition is missing the required `name` property
  - If an option definition has a `type` value that's not a function
  - If an alias is numeric, a hyphen or a length other than 1
  - If an option definition name was used more than once
  - If an option definition alias was used more than once
  - If more than one option definition has `defaultOption: true`


| Param | Type | Description |
| --- | --- | --- |
| optionDefinitions | <code>Array.&lt;module:definition&gt;</code> | An array of [OptionDefinition](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md) objects |
| [options] | <code>object</code> | Options. |
| [options.argv] | <code>Array.&lt;string&gt;</code> | An array of strings which, if present will be parsed instead  of `process.argv`. |
| [options.partial] | <code>boolean</code> | If `true`, an array of unknown arguments is returned in the `_unknown` property of the output. |
| [options.stopAtFirstUnknown] | <code>boolean</code> | If `true`, the parsing will stop at the first unknown argument and the remaining arguments will be put in `_unknown`. |
| [options.camelCase] | <code>boolean</code> | If set, options with hypenated names (e.g. `move-to`) will be returned in camel-case (e.g. `moveTo`). |

