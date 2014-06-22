[![view on npm](http://img.shields.io/npm/v/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![npm module downloads per month](http://img.shields.io/npm/dm/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![Build Status](https://travis-ci.org/75lb/command-line-args.svg?branch=master)](https://travis-ci.org/75lb/command-line-args)
[![Dependency Status](https://david-dm.org/75lb/command-line-args.svg)](https://david-dm.org/75lb/command-line-args)

**work in progress, draft documentation.. not quite ready**

#command-line-args
A command-line parser and usage-guide producer.. Particularly good at organising large sets of options. 

##Install
```sh
$ npm install command-line-args --save
```

##Usage
1. Define your command line options
2. Parse the supplied command line args
3. Get a usage-guide

###Define
Pass the `command-line-args` constructor an array of OptionDefinitions. 

```js
var cliArgs = require("command-line-args");
var cli = cliArgs([
    { name: "verbose", type: Boolean, alias: "v" },
    { name: "files", type: Array, defaultOption: true}
]);
```

###Parse
```js
var argv = cli.parse();
```


##Parse command line args
Supply a list of option definitions and get an instance of `command-line-args` back, complete with `parse` and `usage` methods. 


<a name="module_command-line-args"></a>
##command-line-args(options)
Command-line parser, usage-guide producer.


- options `Array.<module:command-line-args~OptionDefinition>` - list of option definitions

  
####Example
```js
var cliArgs = require("command-line-args");
var cli = cliArgs([
    { name: "verbose", type: Boolean, alias: "v" },
    { name: "files", type: Array, defaultOption: true}
]);
var argv = cli.parse();
```
<a name="module_command-line-args#parse"></a>
###cli.parse([argv])

- [argv] `object` - optional argv array

<a name="module_command-line-args#usage"></a>
###cli.usage(data)

- data `object` - usage options

<a name="module_command-line-args.OptionDefinition"></a>
###type: OptionDefinition


Defines an option

**Scope**: inner typedef of [command-line-args](#module_command-line-args)  
**Type**: `object`  
name - the option name  
type - an optional type contructor function  
