[![view on npm](http://img.shields.io/npm/v/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![npm module downloads per month](http://img.shields.io/npm/dm/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![Build Status](https://travis-ci.org/75lb/command-line-args.svg?branch=rewrite)](https://travis-ci.org/75lb/command-line-args)
[![Dependency Status](https://david-dm.org/75lb/command-line-args.svg)](https://david-dm.org/75lb/command-line-args)

# command-line-args
A library to collect command-line args and generate a usage guide.

## Synopsis
You can set options using the main notation standards (getopt, getopt_long, etc.). These commands are all equivalent, setting the same values:
```
$ my-app --verbose --timeout=1000 --src one.js --src two.js
$ my-app --verbose --timeout 1000 --src one.js two.js
$ my-app -vt 1000 --src one.js two.js
$ my-app -vt 1000 one.js two.js
```

To access the values, first describe the options your app accepts (see [option definitions](#option-definitions)).
```js
var commandLineArgs = require("command-line-args");

var cli = commandLineArgs([
    { name: "verbose", alias: "v", type: Boolean },
    { name: "src", type: String, multiple: true, defaultOption: true },
    { name: "timeout", alias: "t", type: Number }
]);
```
The [`type`](#module_definition--OptionDefinition+type) property is a setter function (the value you receive is the output of this), giving you full control over the value received.

Next, collect the command line args using [.parse()](#module_command-line-args--CommandLineArgs+parse):
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

When dealing with large amounts of options it often makes sense to [group](#module_definition--Definition+group) them.

The [.getUsage()](#module_command-line-args--CommandLineArgs+getUsage) method generates a usage guide. If you add descriptions to each option definition and call `.getUsage()` with some template data, for example:
```js
var usage = cli.getUsage({
    title: "my-app",
    description: "Generates something useful",
    footer: "Project home: [underline]{https://github.com/me/my-app}"
});
```

..then `usage`, written to the terminal, looks something like:

![usage](https://raw.githubusercontent.com/75lb/command-line-usage/master/example/screens/typical.png)

## Install

### as a library
```sh
$ npm install command-line-args --save
```

### as a tool
```sh
$ npm install -g command-line-args
```

If you install globally you get the `command-line-args` test-harness. You test by piping in a module which exports an option definitions array. You can then view the `.parse()` output for the args you pass.

For example:

```sh
$ cat example/typical.js | command-line-args lib/* --timeout=1000
{ src:
   [ 'lib/command-line-args.js',
     'lib/definition.js',
     'lib/definitions.js',
     'lib/option.js' ],
  timeout: 1000 }
```

# API Reference
<a name="module_command-line-args"></a>
## command-line-args
A library to collect command-line args and generate a usage guide.


* [command-line-args](#module_command-line-args)
  * [CommandLineArgs](#exp_module_command-line-args--CommandLineArgs) ⏏
    * [new CommandLineArgs(definitions)](#new_module_command-line-args--CommandLineArgs_new)
    * [.parse([argv])](#module_command-line-args--CommandLineArgs+parse) ⇒ <code>object</code>
    * [.getUsage([options])](#module_command-line-args--CommandLineArgs+getUsage) ⇒ <code>string</code>

<a name="exp_module_command-line-args--CommandLineArgs"></a>
### CommandLineArgs ⏏
A class encapsulating operations you can perform using an [OptionDefinition](#exp_module_definition--OptionDefinition) array as input.

**Kind**: Exported class  
<a name="new_module_command-line-args--CommandLineArgs_new"></a>
#### new CommandLineArgs(definitions)

| Param | Type | Description |
| --- | --- | --- |
| definitions | <code>[Array.&lt;definition&gt;](#module_definition)</code> | An optional array of [OptionDefinition](#exp_module_definition--OptionDefinition) objects |

**Example**  
```js
var commandLineArgs = require("command-line-args");
var cli = commandLineArgs([
    { name: "file" },
    { name: "verbose" },
    { name: "depth"}
]);
```
<a name="module_command-line-args--CommandLineArgs+parse"></a>
#### cli.parse([argv]) ⇒ <code>object</code>
Returns an object containing all the values and flags set on the command line. By default it parses the global [`process.argv`](https://nodejs.org/api/process.html#process_process_argv) array.

**Kind**: instance method of <code>[CommandLineArgs](#exp_module_command-line-args--CommandLineArgs)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [argv] | <code>Array.&lt;string&gt;</code> | An array of strings, which if passed will be parsed instead of `process.argv`. |

<a name="module_command-line-args--CommandLineArgs+getUsage"></a>
#### cli.getUsage([options]) ⇒ <code>string</code>
Generates a usage guide. Please see [command-line-usage](https://github.com/75lb/command-line-usage) for full instructions of how to use.

**Kind**: instance method of <code>[CommandLineArgs](#exp_module_command-line-args--CommandLineArgs)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | the options to pass to [command-line-usage](https://github.com/75lb/command-line-usage) |


<a name="exp_module_definition--OptionDefinition"></a>
## OptionDefinition ⏏
Describes a command-line option.

**Kind**: Exported class  
* [OptionDefinition](#exp_module_definition--OptionDefinition) ⏏
  * [.name](#module_definition--OptionDefinition+name) : <code>string</code>
  * [.type](#module_definition--OptionDefinition+type) : <code>function</code>
  * [.alias](#module_definition--OptionDefinition+alias) : <code>string</code>
  * [.multiple](#module_definition--OptionDefinition+multiple) : <code>boolean</code>
  * [.defaultOption](#module_definition--OptionDefinition+defaultOption) : <code>boolean</code>
  * [.defaultValue](#module_definition--OptionDefinition+defaultValue) : <code>\*</code>
  * [.group](#module_definition--OptionDefinition+group) : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>

<a name="module_definition--OptionDefinition+name"></a>
### option.name : <code>string</code>
The only required definition property is `name`, so the simplest working example is
```js
[
    { name: "file" },
    { name: "verbose" },
    { name: "depth"}
]
```

In this case, the value of each option will be either a Boolean or string.

| #   | Command line args | .parse() output |
| --- | -------------------- | ------------ |
| 1   | `--file` | `{ file: true }` |
| 2   | `--file lib.js --verbose` | `{ file: "lib.js", verbose: true }` |
| 3   | `--verbose very` | `{ verbose: "very" }` |
| 4   | `--depth 2` | `{ depth: "2" }` |

**Kind**: instance property of <code>[OptionDefinition](#exp_module_definition--OptionDefinition)</code>  
<a name="module_definition--OptionDefinition+type"></a>
### option.type : <code>function</code>
The `type` value is a setter function (you receive the output from this), enabling you to be specific about the type and value received.

You can use a class, if you like:

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

| #   | Command line args| .parse() output |
| --- | ----------------- | ------------ |
| 1   | `--file asdf.txt` | `{ file: { filename: 'asdf.txt', exists: false } }` |

The `--depth` option expects a `Number`. If no value was set, you will receive `null`. 

| #   | Command line args | .parse() output |
| --- | ----------------- | ------------ |
| 2   | `--depth` | `{ depth: null }` |
| 3   | `--depth 2` | `{ depth: 2 }` |

**Kind**: instance property of <code>[OptionDefinition](#exp_module_definition--OptionDefinition)</code>  
<a name="module_definition--OptionDefinition+alias"></a>
### option.alias : <code>string</code>
getopt-style short option names. Must be a single character.

```js
[
  { name: "hot", alias: "h", type: Boolean },
  { name: "discount", alias: "d", type: Boolean },
  { name: "courses", alias: "c" , type: Number }
]
```

| #   | Command line | .parse() output |
| --- | ------------ | ------------ |
| 1   | `-hcd` | `{ hot: true, courses: null, discount: true }` |
| 2   | `-hdc 3` | `{ hot: true, discount: true, courses: 3 }` |

**Kind**: instance property of <code>[OptionDefinition](#exp_module_definition--OptionDefinition)</code>  
<a name="module_definition--OptionDefinition+multiple"></a>
### option.multiple : <code>boolean</code>
Set this flag if the option takes a list of values. You will receive an array of values passed through the `type` function (if specified).

```js
module.exports = [
    { name: "files", type: String, multiple: true }
];
```

| #   | Command line | .parse() output |
| --- | ------------ | ------------ |
| 1   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 2   | `--files one.js --files two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 3   | `--files *` | `{ files: [ 'one.js', 'two.js' ] }` |

**Kind**: instance property of <code>[OptionDefinition](#exp_module_definition--OptionDefinition)</code>  
<a name="module_definition--OptionDefinition+defaultOption"></a>
### option.defaultOption : <code>boolean</code>
Any unclaimed command-line args will be set on this option. This flag is typically set on the most commonly-used option to make for more concise usage (i.e. `$ myapp *.js` instead of `$ myapp --files *.js`).

```js
module.exports = [
    { name: "files", type: String, multiple: true, defaultOption: true }
];
```

| #   | Command line | .parse() output |
| --- | ------------ | ------------ |
| 1   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 2   | `one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
| 3   | `*` | `{ files: [ 'one.js', 'two.js' ] }` |

**Kind**: instance property of <code>[OptionDefinition](#exp_module_definition--OptionDefinition)</code>  
<a name="module_definition--OptionDefinition+defaultValue"></a>
### option.defaultValue : <code>\*</code>
An initial value for the option.

```js
module.exports = [
    { name: "files", type: String, multiple: true, defaultValue: [ "one.js" ] },
    { name: "max", type: Number, defaultValue: 3 }
];
```

| #   | Command line | .parse() output |
| --- | ------------ | ------------ |
| 1   |  | `{ files: [ 'one.js' ], max: 3 }` |
| 2   | `--files two.js` | `{ files: [ 'two.js' ], max: 3 }` |
| 3   | `--max 4` | `{ files: [ 'one.js' ], max: 4 }` |

**Kind**: instance property of <code>[OptionDefinition](#exp_module_definition--OptionDefinition)</code>  
<a name="module_definition--OptionDefinition+group"></a>
### option.group : <code>string</code> &#124; <code>Array.&lt;string&gt;</code>
When your app has a large amount of options it makes sense to organise them in groups. 

```js
module.exports = [
    { name: "verbose", group: "standard" },
    { name: "help", group: [ "standard", "main" ] },
    { name: "compress", group: [ "server", "main" ] },
    { name: "static", group: "server" },
    { name: "debug" }
];
```

<table>
 <tr>
   <th>#</th><th>Command Line</th><th>.parse() output</th>
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

**Kind**: instance property of <code>[OptionDefinition](#exp_module_definition--OptionDefinition)</code>  


* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
