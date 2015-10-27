# Examples

All these example files are modules exporting an array of [Option Definitions](https://github.com/75lb/command-line-args#optiondefinition-). They are consumed using the command-line-args test harness.

The one exception is `validate.js`. This is executed as a script:

```
$ node example/validate.js
```

## Install
Install the test harness:

```
$ npm install -g command-line-args
```

## Usage
Try one of the examples out

```
$ cat example/typical.js | command-line-args --timeout 100 --src lib/*

{ timeout: 100,
  src:
   [ 'lib/argv.js',
     'lib/command-line-args.js',
     'lib/definition.js',
     'lib/definitions.js',
     'lib/option.js' ] }
```
