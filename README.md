[![view on npm](http://img.shields.io/npm/v/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![npm module downloads per month](http://img.shields.io/npm/dm/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![Build Status](https://travis-ci.org/75lb/command-line-args.svg?branch=rewrite)](https://travis-ci.org/75lb/command-line-args)
[![Dependency Status](https://david-dm.org/75lb/command-line-args.svg)](https://david-dm.org/75lb/command-line-args)

# command-line-args
Collect command-line options, generate a usage guide..

- Support most option notation styles
    - long options (`--find lib.js`)
    - short options (`-f lib.js`)
    - getopt-style combinations (`-xvf  lib.js`)
    - option=val style (`--find=lib.js`)
- Customisable usage guide generator
- Modular - define reusage option sets.
- Split options into groups, for apps with a large set of options.
- Fine control over validation, type

## Install
```sh
$ npm install command-line-args --save
```


# API Reference
## Modules
<dl>
<dt><a href="#module_command-line-args">command-line-args</a></dt>
<dd></dd>
<dt><a href="#module_definition">definition</a></dt>
<dd></dd>
<dt><a href="#module_definitions">definitions</a></dt>
<dd></dd>
<dt><a href="#module_option">option</a></dt>
<dd></dd>
</dl>
<a name="module_command-line-args"></a>
## command-line-args
<a name="exp_module_command-line-args--CliArgs"></a>
### CliArgs(definitions, argv) ⇒ <code>object</code> ⏏
**Kind**: Exported function  

| Param | Type |
| --- | --- |
| definitions | <code>module:command-line-args.argDefType</code> | 
| argv | <code>Array.&lt;string&gt;</code> | 

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
    * [.value](#module_definition--Definition+value) : <code>boolean</code>

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
<a name="module_definition--Definition+value"></a>
#### definition.value : <code>boolean</code>
**Kind**: instance property of <code>[Definition](#exp_module_definition--Definition)</code>  
<a name="module_definitions"></a>
## definitions
<a name="module_option"></a>
## option
* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
