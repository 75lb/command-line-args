<a name="module_option-definition"></a>

## option-definition

* [option-definition](#module_option-definition)
    * [OptionDefinition](#exp_module_option-definition--OptionDefinition) ⏏
        * [.name](#module_option-definition--OptionDefinition+name) : <code>string</code>
        * [.type](#module_option-definition--OptionDefinition+type) : <code>function</code>
        * [.alias](#module_option-definition--OptionDefinition+alias) : <code>string</code>
        * [.multiple](#module_option-definition--OptionDefinition+multiple) : <code>boolean</code>
        * [.lazyMultiple](#module_option-definition--OptionDefinition+lazyMultiple) : <code>boolean</code>
        * [.defaultOption](#module_option-definition--OptionDefinition+defaultOption) : <code>boolean</code>
        * [.defaultValue](#module_option-definition--OptionDefinition+defaultValue) : <code>\*</code>
        * [.group](#module_option-definition--OptionDefinition+group) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [.caseSensitive](#module_option-definition--OptionDefinition+caseSensitive) : <code>boolean</code>

<a name="exp_module_option-definition--OptionDefinition"></a>

### OptionDefinition ⏏
Describes a command-line option. Additionally, if generating a usage guide with [command-line-usage](https://github.com/75lb/command-line-usage) you could optionally add `description` and `typeLabel` properties to each definition.

**Kind**: Exported class  
<a name="module_option-definition--OptionDefinition+name"></a>

#### option.name : <code>string</code>
The only required definition property is `name`, so the simplest working example is
```js
const optionDefinitions = [
  { name: 'file' },
  { name: 'depth' }
]
```

Where a `type` property is not specified it will default to `String`.

| #   | argv input | commandLineArgs() output |
| --- | -------------------- | ------------ |
| 1   | `--file` | `{ file: null }` |
| 2   | `--file lib.js` | `{ file: 'lib.js' }` |
| 3   | `--depth 2` | `{ depth: '2' }` |

Unicode option names and aliases are valid, for example:
```js
const optionDefinitions = [
  { name: 'один' },
  { name: '两' },
  { name: 'три', alias: 'т' }
]
```

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
<a name="module_option-definition--OptionDefinition+type"></a>

#### option.type : <code>function</code>
The `type` value is a setter function (you receive the output from this), enabling you to be specific about the type and value received.

The most common values used are `String` (the default), `Number` and `Boolean` but you can use a custom function, for example:

```js
const fs = require('fs')

class FileDetails {
  constructor (filename) {
    this.filename = filename
    this.exists = fs.existsSync(filename)
  }
}

const cli = commandLineArgs([
  { name: 'file', type: filename => new FileDetails(filename) },
  { name: 'depth', type: Number }
])
```

| #   | argv input | commandLineArgs() output |
| --- | ----------------- | ------------ |
| 1   | `--file asdf.txt` | `{ file: { filename: 'asdf.txt', exists: false } }` |

The `--depth` option expects a `Number`. If no value was set, you will receive `null`.

| #   | argv input | commandLineArgs() output |
| --- | ----------------- | ------------ |
| 2   | `--depth` | `{ depth: null }` |
| 3   | `--depth 2` | `{ depth: 2 }` |

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
**Default**: <code>String</code>  
<a name="module_option-definition--OptionDefinition+alias"></a>

#### option.alias : <code>string</code>
getopt-style short option names. Can be any single character (unicode included) except a digit or hyphen.

```js
const optionDefinitions = [
  { name: 'hot', alias: 'h', type: Boolean },
  { name: 'discount', alias: 'd', type: Boolean },
  { name: 'courses', alias: 'c' , type: Number }
]
```

| #   | argv input | commandLineArgs() output |
| --- | ------------ | ------------ |
| 1   | `-hcd` | `{ hot: true, courses: null, discount: true }` |
| 2   | `-hdc 3` | `{ hot: true, discount: true, courses: 3 }` |

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
<a name="module_option-definition--OptionDefinition+multiple"></a>

#### option.multiple : <code>boolean</code>
Set this flag if the option takes a list of values. You will receive an array of values, each passed through the `type` function (if specified).

```js
const optionDefinitions = [
  { name: 'files', type: String, multiple: true }
]
```

Note, examples 1 and 3 below demonstrate "greedy" parsing which can be disabled by using `lazyMultiple`.

| #   | argv input | commandLineArgs() output |
| --- | ------------ | ------------ |
| 1   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 2   | `--files one.js --files two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 3   | `--files *` | `{ files: [ 'one.js', 'two.js' ] }` |

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
<a name="module_option-definition--OptionDefinition+lazyMultiple"></a>

#### option.lazyMultiple : <code>boolean</code>
Identical to `multiple` but with greedy parsing disabled.

```js
const optionDefinitions = [
  { name: 'files', lazyMultiple: true },
  { name: 'verbose', alias: 'v', type: Boolean, lazyMultiple: true }
]
```

| #   | argv input | commandLineArgs() output |
| --- | ------------ | ------------ |
| 1   | `--files one.js --files two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 2   | `-vvv` | `{ verbose: [ true, true, true ] }` |

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
<a name="module_option-definition--OptionDefinition+defaultOption"></a>

#### option.defaultOption : <code>boolean</code>
Any values unaccounted for by an option definition will be set on the `defaultOption`. This flag is typically set on the most commonly-used option to make for more concise usage (i.e. `$ example *.js` instead of `$ example --files *.js`).

```js
const optionDefinitions = [
  { name: 'files', multiple: true, defaultOption: true }
]
```

| #   | argv input | commandLineArgs() output |
| --- | ------------ | ------------ |
| 1   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 2   | `one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 3   | `*` | `{ files: [ 'one.js', 'two.js' ] }` |

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
<a name="module_option-definition--OptionDefinition+defaultValue"></a>

#### option.defaultValue : <code>\*</code>
An initial value for the option.

```js
const optionDefinitions = [
  { name: 'files', multiple: true, defaultValue: [ 'one.js' ] },
  { name: 'max', type: Number, defaultValue: 3 }
]
```

| #   | argv input | commandLineArgs() output |
| --- | ------------ | ------------ |
| 1   |  | `{ files: [ 'one.js' ], max: 3 }` |
| 2   | `--files two.js` | `{ files: [ 'two.js' ], max: 3 }` |
| 3   | `--max 4` | `{ files: [ 'one.js' ], max: 4 }` |

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
<a name="module_option-definition--OptionDefinition+group"></a>

#### option.group : <code>string</code> \| <code>Array.&lt;string&gt;</code>
When your app has a large amount of options it makes sense to organise them in groups.

There are two automatic groups: `_all` (contains all options) and `_none` (contains options without a `group` specified in their definition).

```js
const optionDefinitions = [
  { name: 'verbose', group: 'standard' },
  { name: 'help', group: [ 'standard', 'main' ] },
  { name: 'compress', group: [ 'server', 'main' ] },
  { name: 'static', group: 'server' },
  { name: 'debug' }
]
```

<table>
 <tr>
   <th>#</th><th>Command Line</th><th>commandLineArgs() output</th>
 </tr>
 <tr>
   <td>1</td><td><code>--verbose</code></td><td><pre><code>
{
 _all: { verbose: true },
 standard: { verbose: true }
}
</code></pre></td>
 </tr>
 <tr>
   <td>2</td><td><code>--debug</code></td><td><pre><code>
{
 _all: { debug: true },
 _none: { debug: true }
}
</code></pre></td>
 </tr>
 <tr>
   <td>3</td><td><code>--verbose --debug --compress</code></td><td><pre><code>
{
 _all: {
   verbose: true,
   debug: true,
   compress: true
 },
 standard: { verbose: true },
 server: { compress: true },
 main: { compress: true },
 _none: { debug: true }
}
</code></pre></td>
 </tr>
 <tr>
   <td>4</td><td><code>--compress</code></td><td><pre><code>
{
 _all: { compress: true },
 server: { compress: true },
 main: { compress: true }
}
</code></pre></td>
 </tr>
</table>

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
<a name="module_option-definition--OptionDefinition+caseSensitive"></a>

#### option.caseSensitive : <code>boolean</code>
Whether the option is case sensitive. Defaults to true. The UNIX-based command line is traditionally case sensitive, but the Windows command line is not.

When case insensitivity is used, all defined options must have unambiguous names.
An invalid definition error is thrown if any option definition names conflict due to the use of case insensitivity.

Note that this option does NOT apply to aliases - aliases are always case sensitive.

```js
const optionDefinitions = [
  { name: 'file' }
]
```

| #   | argv input | commandLineArgs() output |
| --- | -------------------- | ------------ |
| 1   | `--file` | `{ file: null }` |
| 2   | `--FILE=Lib.js` | `{ file: 'Lib.js' }` |
| 3   | `--fILe 2` | `{ file: '2' }` |

**Kind**: instance property of [<code>OptionDefinition</code>](#exp_module_option-definition--OptionDefinition)  
**Default**: <code>true</code>  
