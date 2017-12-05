[![view on npm](https://img.shields.io/npm/v/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![npm module downloads](https://img.shields.io/npm/dt/command-line-args.svg)](https://www.npmjs.org/package/command-line-args)
[![Build Status](https://travis-ci.org/75lb/command-line-args.svg?branch=master)](https://travis-ci.org/75lb/command-line-args)
[![Coverage Status](https://coveralls.io/repos/github/75lb/command-line-args/badge.svg?branch=master)](https://coveralls.io/github/75lb/command-line-args?branch=master)
[![Dependency Status](https://david-dm.org/75lb/command-line-args.svg)](https://david-dm.org/75lb/command-line-args)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Join the chat at https://gitter.im/75lb/command-line-args](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/75lb/command-line-args?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# command-line-args
A mature, feature-complete library to parse command-line options.

*If your app requires a git-like command interface, consider using [command-line-commands](https://github.com/75lb/command-line-commands).*

## Synopsis
You can set options using the main notation standards (getopt, getopt_long, etc.). These commands are all equivalent, setting the same values:
```
$ example --verbose --timeout=1000 --src one.js --src two.js
$ example --verbose --timeout 1000 --src one.js two.js
$ example -vt 1000 --src one.js two.js
$ example -vt 1000 one.js two.js
```

See the [notation rules page](https://github.com/75lb/command-line-args/wiki/Notation-rules) to learn more. To access the values, first describe the options your app accepts (see the [option definition documentation](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md)).
```js
const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', type: String, multiple: true, defaultOption: true },
  { name: 'timeout', alias: 't', type: Number }
]
```
The [`type`](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md#optiontype--function) property is a setter function (the value supplied is passed through this), giving you full control over the value received.

Next, parse the options using [commandLineArgs()](https://github.com/75lb/command-line-args/blob/next/doc/API.md#commandlineargsoptiondefinitions-options--object-):
```js
const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)
```

`options` now looks like this:
```js
{
  files: [
    'one.js',
    'two.js'
  ],
  verbose: true,
  timeout: 1000
}
```

A usage guide can be generated using [command-line-usage](https://github.com/75lb/command-line-usage), for example:

![usage](https://raw.githubusercontent.com/75lb/command-line-usage/master/example/screens/footer.png)

The [polymer-cli](https://github.com/Polymer/polymer-cli/) usage guide is a good real-life example.

![usage](https://raw.githubusercontent.com/75lb/command-line-usage/master/example/screens/polymer.png)

### Ambiguous values

Imagine we are using "grep-tool" to search for the string `'-f'`:

```
$ grep-tool --search -f
```

We have an issue here: command-line-args will assume we are setting two options (`--search` and `-f`). In actuality, we are passing one option (`--search`) and one value (`-f`). In cases like this, avoid ambiguity by using `--option=value` notation:

```
$ grep-tool --search=-f
```

### Partial parsing

By default, if the user sets an option without a valid [definition](#exp_module_definition--OptionDefinition) an `UNKNOWN_OPTION` exception is thrown. However, in some cases you may only be interested in a subset of the options wishing to pass the remainder to another library. See [here](https://github.com/75lb/command-line-args/blob/master/example/mocha.js) for a example showing where this might be necessary.

To enable partial parsing, set `partial: true` in the method options:

```js
const optionDefinitions = [
  { name: 'value', type: Number }
]
const options = commandLineArgs(optionDefinitions, { partial: true })
```

Now, should any unknown args be passed at the command line:

```
$ example --milk --value 2 --bread cheese
```

They will be returned in the `_unknown` property of the `commandLineArgs` output with no exceptions thrown:

```js
{
  value: 2,
  _unknown: [ '--milk', '--bread', 'cheese']
}
```

### Less greedy parsing

```
$ example --files one.js two.js three.js
```

```js
const options = commandLineArgs(optionDefinitions, { greedy: false })
```

```
$ example --files one.js --files two.js --files three.js
```

### More strict parsing

```js
const options = commandLineArgs(optionDefinitions)
```

```
$ example --input one.js two.js
```

```js
const options = commandLineArgs(optionDefinitions, { strict: true })
```

```
$ example --input one.js two.js
```


### Grouping

When dealing with large amounts of options it often makes sense to [group](#optiongroup--string--arraystring) them.

## Install

```sh
$ npm install command-line-args --save
```

## Further Reading

Please see [the wiki](https://github.com/75lb/command-line-args/wiki) for further examples and documentation.

* * *

&copy; 2014-18 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
