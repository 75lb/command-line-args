[![view on npm](http://img.shields.io/npm/v/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![npm module downloads per month](http://img.shields.io/npm/dm/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![Build Status](https://travis-ci.org/75lb/command-line-args.svg?branch=master)](https://travis-ci.org/75lb/command-line-args)
[![Dependency Status](https://david-dm.org/75lb/command-line-args.svg)](https://david-dm.org/75lb/command-line-args)

**work in progress, draft documentation**

# command-line-args
A command-line parser and usage-guide producer.. Particularly good at organising large sets of options. 

## Install
```sh
$ npm install command-line-args --save
```

## Synopsis
the following `app.js`...
```js
var cliArgs = require("command-line-args");

/* define the command-line options */
var cli = cliArgs([
    { name: "verbose", type: Boolean, alias: "v", description: "Write plenty output" },
    { name: "help", type: Boolean, description: "Print usage instructions" },
    { name: "files", type: Array, defaultOption: true, description: "The input files" }
]);

/* parse the supplied command-line values */
var options = cli.parse();

/* generate a usage guide */
var usage = cli.getUsage({
    header: "A synopsis application.",
    footer: "For more information, visit http://example.com"
});
    
console.log(options.help ? usage : options);
```
...returns this output at the command line:
```sh
$ node app.js
{}

$ node app.js -v
{ verbose: true }

$ node app.js README.md package.json
{ files: [ 'README.md', 'package.json' ] }

$ node app.js README.md package.json -v
{ verbose: true, files: [ 'README.md', 'package.json' ] }

$ node app.js --help

  A synopsis application.

  Usage

  -v, --verbose    Write plenty output
  --help           Print usage instructions
  --files <array>  The input files

  For more information, visit http://example.com

```

# API Reference
<a name="module_command-line-args"></a>
## command-line-args
**Example**  
```js
var cliArgs = require("command-line-args");
var cli = cliArgs([
    { name: "help", type: Boolean, alias: "h" },
    { name: "files", type: Array, defaultOption: true}
]);
var argv = cli.parse();
```

* [command-line-args](#module_command-line-args)
  * [CliArgs](#exp_module_command-line-args--CliArgs) ⏏
    * [new CliArgs(options)](#new_module_command-line-args--CliArgs_new)
    * _instance_
      * [.parse([argv])](#module_command-line-args--CliArgs#parse) ⇒ <code>object</code>
      * [.getUsage([options])](#module_command-line-args--CliArgs#getUsage) ⇒ <code>string</code>
    * _inner_
      * [~OptionDefinition](#module_command-line-args--CliArgs..OptionDefinition) : <code>object</code>

<a name="exp_module_command-line-args--CliArgs"></a>
### CliArgs ⏏
**Kind**: Exported class  
<a name="new_module_command-line-args--CliArgs_new"></a>
#### new CliArgs(options)
A constructor function, taking your desired command-line option definitions as input, returning an instance of `command-line-args` which you can `parse()` or `getUsage()`.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>[Array.&lt;OptionDefinition&gt;](#module_command-line-args--CliArgs..OptionDefinition)</code> | list of option definitions |

<a name="module_command-line-args--CliArgs#parse"></a>
#### cliArgs.parse([argv]) ⇒ <code>object</code>
Returns a flat, or grouped object containing the values set at the command-line

**Kind**: instance method of <code>[CliArgs](#exp_module_command-line-args--CliArgs)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [argv] | <code>object</code> | <code>process.argv</code> | Optional argv array, pass to override the default `process.argv`. |

**Example**  
Output from `parse()` looks something like this:
```js
{
    delete: "thisfile.txt",
    force: true
}
```

or, if the option definitions are grouped:
```js
{
    standard: {
        delete: "thisfile.txt",
        force: true
    },
    extra: {
        intentions: "bad"
    }
}
```
<a name="module_command-line-args--CliArgs#getUsage"></a>
#### cliArgs.getUsage([options]) ⇒ <code>string</code>
**Kind**: instance method of <code>[CliArgs](#exp_module_command-line-args--CliArgs)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | options for template |
| [options.title] | <code>string</code> | a title |
| [options.header] | <code>string</code> | a header |
| [options.footer] | <code>string</code> | a footer |
| [options.forms] | <code>array</code> | the invocation forms |
| [options.groups] | <code>array</code> | the groups to display in usage |

<a name="module_command-line-args--CliArgs..OptionDefinition"></a>
#### CliArgs~OptionDefinition : <code>object</code>
Defines an option

**Kind**: inner typedef of <code>[CliArgs](#exp_module_command-line-args--CliArgs)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the option name, used as the long option (e.g. `--name`) |
| type | <code>function</code> | an optional function (e.g. `Number` or a custom function) used as a setter to enforce type. |
| alias | <code>string</code> | a single character alias, used as the short option (e.g. `-n`) |
| defaultOption | <code>boolean</code> | if values are specified without an option name, they are assigned to the defaultOption |
| description | <code>string</code> | used in the usage guide |


* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
