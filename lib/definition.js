"use strict";

/**
@module definition
*/
module.exports = OptionDefinition;

/**
@class
@classdesc Describes an command-line option 
@alias module:definition
@typicalname option
*/
function OptionDefinition(definition){
    /**
    * The only required definition property is `name`, so the simplest working example is
    * ```js
    * [
    *     { name: "file" },
    *     { name: "verbose" },
    *     { name: "depth"}
    * ]
    * ```
    * 
    * In this case, the value of each option will be either a Boolean or string.
    *
    * | #   | Command line args | parse output |
    * | --- | -------------------- | ------------ |
    * | 1   | `--file` | `{ file: true }` |
    * | 2   | `--file lib.js --verbose` | `{ file: "lib.js", verbose: true }` |
    * | 3   | `--verbose very` | `{ verbose: "very" }` |
    * | 4   | `--depth 2` | `{ depth: "2" }` |
    * 
    * @type {string}
    */
    this.name = definition.name;

    /**
    * Take control and be more specific about type..
    * 
    * ```js
    * var fs = require("fs");
    * 
    * function FileDetails(filename){
    *     if (!(this instanceof FileDetails)) return new FileDetails(filename);
    *     this.filename = filename;
    *     this.exists = fs.existsSync(filename);
    * }
    * 
    * module.exports = [
    *     { name: "file", type: FileDetails },
    *     { name: "depth", type: Number }
    * ];
    * ```
    * 
    * | #   | Command line args| parse output |
    * | --- | ----------------- | ------------ |
    * | 5   | `--file asdf.txt` | `{ file: { filename: 'asdf.txt', exists: false } }` |
    * 
    * in 1, main was passed but is set to null (not true, as before) meaning "no value was specified".
    * 
    * | #   | Command line args | parse output |
    * | --- | ----------------- | ------------ |
    * | 6   | `--depth` | `{ depth: null }` |
    * | 6   | `--depth 2` | `{ depth: 2 }` |
    * 
    * @type {function}
    */
    this.type = definition.type;

    /**
    * Short option names. Must be a single character.
    * 
    * ```js
    * [
    *   { name: "hot", alias: "h", type: Boolean },
    *   { name: "discount", alias: "d", type: Boolean },
    *   { name: "courses", alias: "c" , type: Number }
    * ]
    * ```
    * 
    * | #   | Command line | parse output |
    * | --- | ------------ | ------------ |
    * | 7   | `-hcd` | `{ hot: true, courses: null, discount: true }` |
    * | 7   | `-hdc 3` | `{ hot: true, discount: true, courses: 3 }` |
    * 
    * @type {string}
    */
    this.alias = definition.alias;

    /**
    * ```js
    * module.exports = [
    *     { name: "files", type: String, multiple: true }
    * ];
    * ```
    * 
    * | #   | Command line | parse output |
    * | --- | ------------ | ------------ |
    * | 8   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
    * | 9   | `--files one.js --files two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
    * | 10   | `--files *` | `{ files: [ 'one.js', 'two.js' ] }` |
    * 
    * @type {boolean}
    */
    this.multiple = definition.multiple;

    /**
    * ```js
    * module.exports = [
    *     { name: "files", type: String, multiple: true, defaultOption: true }
    * ];
    * ```
    * 
    * | #   | Command line | parse output |
    * | --- | ------------ | ------------ |
    * | 11   | `--files one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
    * | 11   | `one.js two.js` | `{ files: [ 'one.js', 'two.js' ] }` |
    * | 12   | `*` | `{ files: [ 'one.js', 'two.js' ] }` |
    * 
    * @type {boolean}
    */
    this.defaultOption = definition.defaultOption;

    /**
    * ```js
    * module.exports = [
    *     { name: "files", type: String, multiple: true, defaultValue: [ "one.js" ] },
    *     { name: "max", type: Number, defaultValue: 3 }
    * ];
    * ```
    * 
    * | #   | Command line | parse output |
    * | --- | ------------ | ------------ |
    * | 13   |  | `{ files: [ 'one.js' ], max: 3 }` |
    * | 14   | `--files two.js` | `{ files: [ 'one.js', 'two.js' ], max: 3 }` |
    * | 15   | `--max 4` | `{ files: [ 'one.js' ], max: 4 }` |
    * 
    * @type {*}
    */
    this.defaultValue = definition.defaultValue;

    /**
    * When your app has a large amount of options it makes sense to organise them in groups. For example, you may want to delegate the `video`and `audio` options to separate 3rd party libraries.
    * 
    * ```js
    * module.exports = [
    *     { name: "verbose", group: "standard" },
    *     { name: "help", group: [ "standard", "main" ] },
    *     { name: "compress", group: [ "server", "main" ] },
    *     { name: "static", group: "server" },
    *     { name: "debug" }
    * ];
    * ```
    * 
    *<table>
    *  <tr>
    *    <th>#</th><th>Command Line</th><th>parse output</th>
    *  </tr>
    *  <tr>
    *    <td>13</td><td><code>--verbose</code></td><td><pre><code>
    *{ 
    *  _all: { verbose: true }, 
    *  standard: { verbose: true } 
    *}
    *</code></pre></td>
    *  </tr>
    *  <tr>
    *    <td>14</td><td><code>--debug</code></td><td><pre><code>
    *{ 
    *  _all: { debug: true }, 
    *  _none: { debug: true } 
    *}
    *</code></pre></td>
    *  </tr>
    *  <tr>
    *    <td>15</td><td><code>--verbose --debug --compress</code></td><td><pre><code>
    *{ 
    *  _all: { 
    *    verbose: true, 
    *    debug: true, 
    *    compress: true 
    *  }, 
    *  standard: { verbose: true }, 
    *  server: { compress: true }, 
    *  main: { compress: true }, 
    *  _none: { debug: true } 
    *}
    *</code></pre></td>
    *  </tr>
    *  <tr>
    *    <td>16</td><td><code>--compress</code></td><td><pre><code>
    *{ 
    *  _all: { compress: true }, 
    *  server: { compress: true }, 
    *  main: { compress: true } 
    *}
    *</code></pre></td>
    *  </tr>
    *</table>
    *
    * @type {string|string[]}
    */
    this.group = definition.group;

    /* pick up any remaining properties */    
    for (var prop in definition){
        if (!this[prop]) this[prop] = definition[prop];
    }
}

OptionDefinition.prototype.getInitialValue = function(){
    if (this.multiple){
        return [];
    } else if (this.isBoolean() || !this.type){
        return true;
    } else {
        return null;
    }
};
OptionDefinition.prototype.isBoolean = function(){
    return this.type === Boolean;
};
