[![view on npm](http://img.shields.io/npm/v/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![npm module downloads per month](http://img.shields.io/npm/dm/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![Build Status](https://travis-ci.org/75lb/command-line-args.svg?branch=rewrite)](https://travis-ci.org/75lb/command-line-args)
[![Dependency Status](https://david-dm.org/75lb/command-line-args.svg)](https://david-dm.org/75lb/command-line-args)

# command-line-args
A library to collect command-line options and generate a usage guide.

## Synopsis
If your app was run with a command like this:
```sh
$ my-app -vt 1000 lib/*.js
```

command-line-args would parse and return the values like this:
```js
{ files:
   [ 'lib/command-line-args.js',
     'lib/definition.js',
     'lib/definitions.js',
     'lib/option.js' ],
  verbose: true,
  timeout: 1000  }
 ```

and the usage guide would look like:
```
  a typical app
  Generates something useful

  Usage
  $ cat input.json | my-app [<options>]
  $ my-app <files>

  Main options
  This group contains the most important options.

  -h, --help               Display this usage guide.
  -f, --files <string[]>   The input files to process
  -t, --timeout <number>   Timeout value in ms

  Project home: https://github.com/me/my-app
```

The option definitions for this particular case look like:

```js
[
    { name: "help", alias: "h", type: Boolean, description: "Display this usage guide." },
    { name: "files", alias: "f", type: String, multiple: true, defaultOption: true, description: "The input files to process" },
    { name: "timeout", alias: "t", type: Number, description: "Timeout value in ms" }
]
```

## Option definitions
Options are defined as an array of Definition objects.

### Name
The only required definition property is `name`, so the simplest working example is
```js
[
  { name: "file" },
  { name: "verbose" }
]
```

In this case, the value of each option will be either a Boolean or string.

#### Examples

| #   | Command line args | parse output |
| --- | -------------------- | ------------ |
| 1   | `--file` | `{ file: true }` |
| 2   | `--file lib.js --verbose` | `{ file: "lib.js", verbose: true }` |
| 3   | `--file lib.js --verbose very` | `{ file: "lib.js", verbose: "very" }` |

### Type
Take control and be more specific about type..

```js
module.exports = [
    { name: "main", type: String },
    { name: "dessert", type: Dessert },
    { name: "courses", type: Number }
];

function FileDetails(file){
    if (!(this instanceof FileDetails)) return new FileDetails(name);
    this.name = name;
}
```

| #   | Command line args| parse output |
| --- | ----------------- | ------------ |
| 5   | `--main --courses 3` | `{ main: null, courses: 3 }` |

in 1, main was passed but is set to null (not true, as before) meaning "no value was specified".

| #   | Command line args | parse output |
| --- | ----------------- | ------------ |
| 6   | `--main Beef --dessert "Spotted Dick"` | `{ main: 'Beef', dessert: { name: 'Spotted Dick' } }` |

### Short option names
```js
[
  { name: "hot", alias: "h", type: Boolean },
  { name: "discount", alias: "d", type: Boolean },
  { name: "courses", alias: "c" , type: Number }
]
```

| #   | Command line | parse output |
| --- | ------------ | ------------ |
| 7   | `-hcd` | `{ hot: true, courses: null, discount: true }` |
| 7   | `-hdc 3` | `{ hot: true, discount: true, courses: 3 }` |

### Multiple option values

```js
module.exports = [
    { name: "files", type: String, multiple: true }
];
```

| #   | Command line | parse output |
| --- | ------------ | ------------ |
| 8   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 9   | `--files one.js --files two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 10   | `--files *` | `{ files: [ 'one.js', 'two.js' ] }` |

### Default option

```js
module.exports = [
    { name: "files", type: String, multiple: true, defaultOption: true }
];
```

| #   | Command line | parse output |
| --- | ------------ | ------------ |
| 11   | `one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 12   | `*` | `{ files: [ 'one.js', 'two.js' ] }` |

### Default option value

```js
module.exports = [
    { name: "files", type: String, multiple: true, defaultValue: [ "one.js" ] },
    { name: "max", type: Number, defaultValue: 3 }
];
```

| #   | Command line | parse output |
| --- | ------------ | ------------ |
| 13   | `` | `{ files: [ 'one.js' ], max: 3 }` |
| 14   | `--files two.js` | `{ files: [ 'one.js', 'two.js' ], max: 3 }` |
| 15   | `--max 4` | `{ files: [ 'one.js' ], max: 4 }` |


### Validate
Validation is out of scope for this library, which collects values only. Validate using another module or some code of your own. This example uses [test-value](https://github.com/75lb/test-value).

```js
var cliArgs = require("command-line-args");
var testValue = require("test-value");
var fs = require("fs");

var cli = cliArgs([
    { name: "help", type: Boolean },
    { name: "files", type: String, multiple: true, defaultOption: true },
    { name: "log-level", type: String }
]);

var options = cli.parse();
var validForms = {};

validForms.main = {
    files: function(files){
        return files && files.every(fs.existsSync);
    },
    "log-level": [ "info", "warn", "error", null, undefined ]
};

validForms.help = {
    help: true
};

var valid = testValue(options, [ validForms.main, validForms.help ]);

console.log(valid, options);
```

## Install

### as a library
```sh
$ npm install command-line-args --save
```

### as a command-line tool
```sh
$ npm install -g command-line-args
```

If you install globally you get the `command-line-args` test-harness. You test by piping in a module exporting an option definitions array,

All the following examples can be sampled by installing the command-line-args test harness (install globally). Usage:

```sh
$ cat example/one.js | command-line-args --main
{ main: true }

$ cat example/one.js | command-line-args --main --dessert
{ main: true, dessert: true }
```



# API Reference
## Modules
<dl>
<dt><a href="#module_command-line-args">command-line-args</a></dt>
<dd></dd>
<dt><a href="#module_definition">definition</a></dt>
<dd></dd>
<dt><a href="#module_usage-options">usage-options</a></dt>
<dd></dd>
</dl>
<a name="module_command-line-args"></a>
## command-line-args

* [command-line-args](#module_command-line-args)
  * [CliArgs](#exp_module_command-line-args--CliArgs) ⏏
    * [new CliArgs(definitions)](#new_module_command-line-args--CliArgs_new)
    * [.parse([argv])](#module_command-line-args--CliArgs+parse) ⇒ <code>object</code>
    * [.getUsage([options])](#module_command-line-args--CliArgs+getUsage) ⇒ <code>string</code>

<a name="exp_module_command-line-args--CliArgs"></a>
### CliArgs ⏏
**Kind**: Exported class  
<a name="new_module_command-line-args--CliArgs_new"></a>
#### new CliArgs(definitions)

| Param | Type |
| --- | --- |
| definitions | <code>[Array.&lt;definition&gt;](#module_definition)</code> | 

<a name="module_command-line-args--CliArgs+parse"></a>
#### cliArgs.parse([argv]) ⇒ <code>object</code>
**Kind**: instance method of <code>[CliArgs](#exp_module_command-line-args--CliArgs)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [argv] | <code>Array.&lt;string&gt;</code> | parses `process.argv` by default, unless you pass this |

<a name="module_command-line-args--CliArgs+getUsage"></a>
#### cliArgs.getUsage([options]) ⇒ <code>string</code>
**Kind**: instance method of <code>[CliArgs](#exp_module_command-line-args--CliArgs)</code>  

| Param | Type |
| --- | --- |
| [options] | <code>[usage-options](#module_usage-options)</code> | 

<a name="module_definition"></a>
## definition

* [definition](#module_definition)
  * [Definition](#exp_module_definition--Definition) ⏏
    * [.name](#module_definition--Definition+name) : <code>string</code>
    * [.type](#module_definition--Definition+type) : <code>function</code>
    * [.description](#module_definition--Definition+description) : <code>string</code>
    * [.alias](#module_definition--Definition+alias) : <code>string</code>
    * [.multiple](#module_definition--Definition+multiple) : <code>boolean</code>
    * [.defaultOption](#module_definition--Definition+defaultOption) : <code>boolean</code>
    * [.group](#module_definition--Definition+group) : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
    * [.defaultValue](#module_definition--Definition+defaultValue) : <code>\*</code>

<a name="exp_module_definition--Definition"></a>
### Definition ⏏
Option Definition

**Kind**: Exported class  
<a name="module_definition--Definition+name"></a>
#### definition.name : <code>string</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_definition--Definition+type"></a>
#### definition.type : <code>function</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_definition--Definition+description"></a>
#### definition.description : <code>string</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_definition--Definition+alias"></a>
#### definition.alias : <code>string</code>
a single character

**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_definition--Definition+multiple"></a>
#### definition.multiple : <code>boolean</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_definition--Definition+defaultOption"></a>
#### definition.defaultOption : <code>boolean</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_definition--Definition+group"></a>
#### definition.group : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_definition--Definition+defaultValue"></a>
#### definition.defaultValue : <code>\*</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_usage-options"></a>
## usage-options

* [usage-options](#module_usage-options)
  * [UsageOptions](#exp_module_usage-options--UsageOptions) ⏏
    * [.title](#module_usage-options--UsageOptions+title) : <code>string</code>
    * [.description](#module_usage-options--UsageOptions+description) : <code>string</code>
    * [.forms](#module_usage-options--UsageOptions+forms) : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
    * [.groups](#module_usage-options--UsageOptions+groups) : <code>object</code>
    * [.footer](#module_usage-options--UsageOptions+footer) : <code>string</code>
    * [.hide](#module_usage-options--UsageOptions+hide) : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>

<a name="exp_module_usage-options--UsageOptions"></a>
### UsageOptions ⏏
**Kind**: Exported class  
<a name="module_usage-options--UsageOptions+title"></a>
#### usageOptions.title : <code>string</code>
**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
<a name="module_usage-options--UsageOptions+description"></a>
#### usageOptions.description : <code>string</code>
**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
<a name="module_usage-options--UsageOptions+forms"></a>
#### usageOptions.forms : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
<a name="module_usage-options--UsageOptions+groups"></a>
#### usageOptions.groups : <code>object</code>
if you have groups, only names specified here will appear in the output

**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
<a name="module_usage-options--UsageOptions+footer"></a>
#### usageOptions.footer : <code>string</code>
**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
<a name="module_usage-options--UsageOptions+hide"></a>
#### usageOptions.hide : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
