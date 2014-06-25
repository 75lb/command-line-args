"use strict";
var a = require("array-tools"),
    o = require("object-tools"),
    s = require("string-tools"),
    util = require("util"),
    Design = require("nature").Design,
    handlebars = require("handlebars"),
    fs = require("fs"),
    path = require("path");

/**
@module
@example
```js
var cliArgs = require("command-line-args");
var cli = cliArgs([
    { name: "help", type: Boolean, alias: "h" },
    { name: "files", type: Array, defaultOption: true}
]);
var argv = cli.parse();
```
@alias cli
*/
module.exports = CliArgs;

require("../template/helpers/columns")(handlebars);
require("handlebars-ansi")(handlebars);
handlebars.registerPartial(
    "columns",
    fs.readFileSync(path.resolve(__dirname, "../template/partials/columns.hbs"), "utf8")
);
handlebars.logger.level = 1;

/**
A constructor function, taking your desired command-line option definitions as input, returning an instance of `command-line-args` which you can `parse()` or `getUsage()`.
@class
@param {module:command-line-args~OptionDefinition[]} - list of option definitions
@alias module:command-line-args
*/
function CliArgs(options){
    if (!(this instanceof CliArgs)) return new CliArgs(options);

    options.forEach(function(option){
        if (option.options) option.attributes = option.options;
    });

    Design.call(this, options);
}
util.inherits(CliArgs, Design);

/**
Returns a flat, or grouped object containing the values set at the command-line
@param [argv=process.argv] {object} - Optional argv array, pass to override the default `process.argv`.
@returns {object}
@example
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
*/
CliArgs.prototype.parse = function(argv){
    var shortArg = /^-(\w)/,
        longArg = /^--([\w-]+)/,
        model = this.create(),
        defaultValues = [],
        self = this,
        arg;

    argv = argv ? argv.slice(0) : process.argv.slice(2);

	function isOption(input){
		return longArg.test(input) || shortArg.test(input);
	}

    function setOutputValue(option, value){
        model[option.name] = value;
    }

    function setOutput(optionName){
        var option = a.findWhere(self._attributes, { name: optionName })
                  || a.findWhere(self._attributes, { alias: optionName });
        if (option){
            if(option.type === Boolean){
                setOutputValue(option, true);
            } else if (argv.length) {
				var value;
                if (typeof option.type === "function" && option.type === Array){
	                value = a.spliceWhile(argv, 0, /^\w+/);
				} else {
					if (isOption(argv[0])){
						value = null;
					} else {
						value = argv.shift();
						value = typeof option.type === "function" ? option.type(value) : value;
					}
				}
				setOutputValue(option, value);
			} else {
				setOutputValue(option, null);
			}
        } else {
            throw new Error("Unexpected option: " + optionName);
        }
    };

    while (typeof(arg = argv.shift()) !== "undefined"){
        if (longArg.test(arg)){
            setOutput(arg.match(longArg)[1]);
        } else if (shortArg.test(arg)){
            setOutput(arg.match(shortArg)[1]);
        } else {
            defaultValues.push(arg);
        }
    }

    if (defaultValues.length > 0){
        var defaultOption = a.findWhere(this._attributes, { defaultOption: true });
        if (defaultOption){
            if (defaultOption.type === Array){
                if (Array.isArray(model[defaultOption.name])){
                    model[defaultOption.name] = model[defaultOption.name].concat(defaultValues);
                } else {
                    model[defaultOption.name] = defaultValues;
                }
            } else {
                model[defaultOption.name] = defaultValues[0];
            }
        }
    }

    if (this.groups().length){
        var output = {};
        this.groups().forEach(function(groupName){
            var filter = "return attribute.groups && attribute.groups.indexOf('" + groupName + "') > -1;";
            var optionGroup = o.defined(self.where(filter, model));
            output[groupName] = optionGroup;
        });
        return output;
    } else {
        return o.defined(model);
    }
};

/**
@param {object} options - options for template
@param {string} options.title - a title
@param {string} options.header - a header
@param {string} options.footer - a footer
@param {array} options.forms - the invocation forms
@returns {string}
*/
CliArgs.prototype.getUsage = function(options){
    var self = this;
    options = options || {};
    var template = fs.readFileSync(path.resolve(__dirname, "..", "template", "usage.hbs"), "utf8");
    options.options = this._attributes.map(function(option){
        var type = option.type && option.type.name.toLowerCase();
        type = type === "boolean" ? "" : "<" + type + ">";
        option.column1 = util.format("%s--%s %s", option.alias ? "-" + option.alias + ", " : "", option.name, type);
        return option;
    });
    options.groups = this.groups().map(function(group){
        return {
            name: group,
            options: self._attributes.filter(function(option){
                return option.groups && option.groups.indexOf(group) > -1;
            })
        }
    });
    if (!options.columns) {
        var width = options.options.reduce(function(prev, curr){
            return curr.column1.length > prev ? curr.column1.length : prev;
        }, 0);
        options.columns = [ width + 2 ];
    }
    options.options = options.options.map(function(option){
        option.description = option.description && option.description.replace(/\n/g, "\n" + s.fill(" ", options.columns[0] + 2))
        return option;
    });
    return handlebars.compile(template)(options);
};

/**
Defines an option
@typedef {object} module:command-line-args~OptionDefinition
@property {string} name - the option name, used as the long option (e.g. `--name`)
@property {function} type - an optional function (e.g. `Number` or a custom function) used as a setter to enforce type.
@property {string} alias - a single character alias, used as the short option (e.g. `-n`)
@property {boolean} defaultOption - if values are specified without an option name, they are assigned to the defaultOption
@property {string} description - used in the usage guide
*/
