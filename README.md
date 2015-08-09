[![view on npm](http://img.shields.io/npm/v/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![npm module downloads per month](http://img.shields.io/npm/dm/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![Build Status](https://travis-ci.org/75lb/command-line-args.svg?branch=rewrite)](https://travis-ci.org/75lb/command-line-args)
[![Dependency Status](https://david-dm.org/75lb/command-line-args.svg)](https://david-dm.org/75lb/command-line-args)

# command-line-args
A library to collect command-line args and generate a usage guide.

## Synopsis
Say your app was run with one of these commands (they are all equalivalent and parse the same)
```
$ my-app --verbose --timeout 1000 --src one.js --src two.js 
$ my-app --verbose --timeout 1000 --src one.js two.js 
$ my-app -vt 1000 one.js two.js 
```

then your app can access the values like this:

1. create a `command-line-args` instance, passing your [option definitions](#option-definitions) (an array of objects describing the options your accept accepts).
```js
var cliArgs = require("command-line-args");

var cli = cliArgs([
    {
        name: "help", description: "Display this usage guide.",
        alias: "h", type: Boolean
    },
    {
        name: "src", description: "The input files to process",
        alias: "f", type: String, multiple: true, defaultOption: true
    },
    {
        name: "timeout", description: "Timeout value in ms",
        alias: "t", type: Number,  
    }
]);
```

2. Parse the values using `.parse()`
```js
var options = cli.parse();
```

`options` now looks like this:
```js
{
    files: [
        "one.js",
        "two.js"
    ],
    verbose: true,
    timeout: 1000  
}
```

if you would like the `--help` option to print a usage guide, then this example:
```js
if (options.help){
    console.error(cli.usage({
        title: "my-app",
        description: "Generates something useful",
        footer: "Project home: [underline]{https://github.com/me/my-app}"
    }));
    process.exit(0);
}
```

would output this to the console: 
```
  my-app
  Generates something useful

  Usage
  $ cat input.json | my-app [<options>]
  $ my-app <files>

  -h, --help               Display this usage guide.
  -v, --verbose            Display this usage guide.
  -f, --src <string[]>     The input files to process
  -t, --timeout <number>   Timeout value in ms

  Project home: https://github.com/me/my-app
```

## Option definitions
Options are defined as an array of Definition objects. You can walk through all these files yourself by piping each example into the test harness.

### Name
The only required definition property is `name`, so the simplest working example is
```js
[
    { name: "file" },
    { name: "verbose" },
    { name: "depth"}
]
```

In this case, the value of each option will be either a Boolean or string.

#### Examples

| #   | Command line args | parse output |
| --- | -------------------- | ------------ |
| 1   | `--file` | `{ file: true }` |
| 2   | `--file lib.js --verbose` | `{ file: "lib.js", verbose: true }` |
| 3   | `--verbose very` | `{ verbose: "very" }` |
| 4   | `--depth 2` | `{ depth: "2" }` |

### Type
Take control and be more specific about type..

```js
var fs = require("fs");

function FileDetails(filename){
    if (!(this instanceof FileDetails)) return new FileDetails(filename);
    this.filename = filename;
    this.exists = fs.existsSync(filename);
}

module.exports = [
    { name: "file", type: FileDetails },
    { name: "depth", type: Number }
];
```

| #   | Command line args| parse output |
| --- | ----------------- | ------------ |
| 5   | `--file asdf.txt` | `{ file: { filename: 'asdf.txt', exists: false } }` |

in 1, main was passed but is set to null (not true, as before) meaning "no value was specified".

| #   | Command line args | parse output |
| --- | ----------------- | ------------ |
| 6   | `--depth` | `{ depth: null }` |
| 6   | `--depth 2` | `{ depth: 2 }` |

### Alias
Short option names.

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
| 11   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
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
| 13   |  | `{ files: [ 'one.js' ], max: 3 }` |
| 14   | `--files two.js` | `{ files: [ 'one.js', 'two.js' ], max: 3 }` |
| 15   | `--max 4` | `{ files: [ 'one.js' ], max: 4 }` |

### Group
When your app has a large amount of options it makes sense to organise them in groups. For example, you may want to delegate the `video`and `audio` options to separate 3rd party libraries.

```js
module.exports = [
    { name: "verbose", group: "standard" },
    { name: "help", group: [ "standard", "main" ] },
    { name: "compress", group: [ "server", "main" ] },
    { name: "static", group: "server" },
    { name: "debug" }
];
```

| #   | Command line | parse output |
| --- | ------------ | ------------ |
| 13   | `--verbose` | `{ _all: { verbose: true }, standard: { verbose: true } }` |
| 14   | `--debug` | `{ _all: { debug: true }, _none: { debug: true } }` |
| 15   | `--verbose --debug --compress` | `{ _all: { verbose: true, debug: true, compress: true }, standard: { verbose: true }, server: { compress: true }, main: { compress: true }, _none: { debug: true } }` |
| 15   | `--compress` | `{ _all: { compress: true }, server: { compress: true }, main: { compress: true } }` |

### Validate
Validation is out of scope for this library, which collects values only. Validate using another module or some code of your own. This example uses [test-value](https://github.com/75lb/test-value).

```js
var cliArgs = require("../");
var testValue = require("test-value");
var fs = require("fs");

var cli = cliArgs([
    { name: "help", type: Boolean },
    { name: "files", type: String, multiple: true, defaultOption: true },
    { name: "log-level", type: String }
]);

var options = cli.parse();

var usageForm = {};

usageForm.main = {
    files: function(files){
        return files && files.every(fs.existsSync);
    },
    "log-level": [ "info", "warn", "error", undefined ]
};

usageForm.help = {
    help: true
};

var valid = testValue(options, [ usageForm.main, usageForm.help ]);

if (!valid){
    // exit here
}
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
    * [.alias](#module_definition--Definition+alias) : <code>string</code>
    * [.multiple](#module_definition--Definition+multiple) : <code>boolean</code>
    * [.defaultOption](#module_definition--Definition+defaultOption) : <code>boolean</code>
    * [.group](#module_definition--Definition+group) : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
    * [.defaultValue](#module_definition--Definition+defaultValue) : <code>\*</code>
    * [.description](#module_definition--Definition+description) : <code>string</code>

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
<a name="module_definition--Definition+description"></a>
#### definition.description : <code>string</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_usage-options"></a>
## usage-options

* [usage-options](#module_usage-options)
  * [UsageOptions](#exp_module_usage-options--UsageOptions) ⏏
    * _instance_
      * [.title](#module_usage-options--UsageOptions+title) : <code>string</code> &#124; <code>[textObject](#module_usage-options--UsageOptions..textObject)</code>
      * [.description](#module_usage-options--UsageOptions+description) : <code>string</code> &#124; <code>[textObject](#module_usage-options--UsageOptions..textObject)</code>
      * [.usage](#module_usage-options--UsageOptions+usage) : <code>object</code>
      * [.groups](#module_usage-options--UsageOptions+groups) : <code>object</code>
      * [.footer](#module_usage-options--UsageOptions+footer) : <code>string</code> &#124; <code>[textObject](#module_usage-options--UsageOptions..textObject)</code>
      * [.hide](#module_usage-options--UsageOptions+hide) : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
    * _inner_
      * [~textObject](#module_usage-options--UsageOptions..textObject)

<a name="exp_module_usage-options--UsageOptions"></a>
### UsageOptions ⏏
The class describes all valid options for the `getUsage` function. Inline formatting can be used within any text string supplied using valid [ansi-escape-sequences formatting syntax](https://github.com/75lb/ansi-escape-sequences#module_ansi-escape-sequences.format).

**Kind**: Exported class  
<a name="module_usage-options--UsageOptions+title"></a>
#### options.title : <code>string</code> &#124; <code>[textObject](#module_usage-options--UsageOptions..textObject)</code>
The title line at the top of the usage, typically the name of the app. By default it is underlined but this formatting can be overridden by passing a [textObject](#module_usage-options--UsageOptions..textObject).

**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
**Example**  
```js
{
    title: {
       text: "my-app",
       format: [ "bold", "underline" ]
    }
}
```
<a name="module_usage-options--UsageOptions+description"></a>
#### options.description : <code>string</code> &#124; <code>[textObject](#module_usage-options--UsageOptions..textObject)</code>
A description to go underneath the title. For example, some words about what the app is for.

**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
<a name="module_usage-options--UsageOptions+usage"></a>
#### options.usage : <code>object</code>
An array of strings highlighting the main usage forms of the app.

**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| title | <code>string</code> &#124; <code>[textObject](#module_usage-options--UsageOptions..textObject)</code> | <code>&quot;Usage&quot;</code> | 
| format | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | 

**Example**  
```js
{
    usage: {
        title: "Synopsis",
        forms: [
            "$ my-app <options> <files>",
            "$ my-app [-cvh]"
        ]
    }
}
```
<a name="module_usage-options--UsageOptions+groups"></a>
#### options.groups : <code>object</code>
Specify which groups to display in the output by supplying an object of key/value pairs, where the key is the name of the group to include and the value is a string or textObject. If the value is a string it is used as the group title. Alternatively supply an object containing a `title` and `description` string.

**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
**Example**  
```js
{
    main: { 
        title: "Main options",
        description: "This group contains the most important options."
    },
    misc: "Miscellaneous"
}
```
<a name="module_usage-options--UsageOptions+footer"></a>
#### options.footer : <code>string</code> &#124; <code>[textObject](#module_usage-options--UsageOptions..textObject)</code>
Displayed at the foot of the usage output.

**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
<a name="module_usage-options--UsageOptions+hide"></a>
#### options.hide : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
If you want to hide certain options from the output, specify their names here.

**Kind**: instance property of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
<a name="module_usage-options--UsageOptions..textObject"></a>
#### options~textObject
Contains text and formatting information.

**Kind**: inner typedef of <code>[UsageOptions](#exp_module_usage-options--UsageOptions)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| text | <code>string</code> |  |
| format | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | one or more ansi style names from [this list](https://github.com/75lb/ansi-escape-sequences#module_ansi-escape-sequences.style). |

* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
