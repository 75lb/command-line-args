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
You can set options using the main notation standards ([learn more](https://github.com/75lb/command-line-args/wiki/Notation-rules)). These commands are all equivalent, setting the same values:
```
$ example --verbose --timeout=1000 --src one.js --src two.js
$ example --verbose --timeout 1000 --src one.js two.js
$ example -vt 1000 --src one.js two.js
$ example -vt 1000 one.js two.js
```

To access the values, first create a list of [option definitions](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md) describing your accepted options. The [`type`](https://github.com/75lb/command-line-args/blob/next/doc/option-definition.md#optiontype--function) property is a setter function (the value supplied is passed through this), giving you full control over the value received.

```js
const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', type: String, multiple: true, defaultOption: true },
  { name: 'timeout', alias: 't', type: Number }
]
```

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

## Usage guide generation

A usage guide can be generated using [command-line-usage](https://github.com/75lb/command-line-usage), for example:

![usage](https://raw.githubusercontent.com/75lb/command-line-usage/master/example/screens/footer.png)

The [polymer-cli](https://github.com/Polymer/polymer-cli/) usage guide is a good real-life example.

![usage](https://raw.githubusercontent.com/75lb/command-line-usage/master/example/screens/polymer.png)

## Install

```sh
$ npm install command-line-args --save
```

## Further Reading

Please see [the wiki](https://github.com/75lb/command-line-args/wiki) for further examples and documentation.

* * *

&copy; 2014-18 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
