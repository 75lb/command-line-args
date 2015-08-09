"use strict";
var a = require("array-tools");
var o = require("object-tools");
var util = require("util");
var Definitions = require("./definitions");
var option = require("./option");
var cliUsage = require("command-line-usage");
var findReplace = require("find-replace");
var t = require("typical");

/**
@module command-line-args
*/
module.exports = CliArgs;

/**
@class
@param {module:definition[]}
@alias module:command-line-args
*/
function CliArgs(definitions){
    if (!(this instanceof CliArgs)) return new CliArgs(definitions);
    this.definitions = new Definitions(definitions);
}

/**
@param [argv] {string[]} - parses `process.argv` by default, unless you pass this
@returns {object}
*/
CliArgs.prototype.parse = function(argv){
    var self = this;
    
    /* if no argv supplied, assume we are parsing process.argv */
    argv = argv || process.argv;
    if (argv === process.argv){
        argv.splice(0, 2);
    } else {
        argv = a.arrayify(argv);
    }

    /* expand --option=name style args */
    var optEquals = option.optEquals;
    if (argv.some(optEquals.test.bind(optEquals))){
        var expandedArgs = [];
        argv.forEach(function(arg){
            var matches = arg.match(optEquals.re);
            if (matches){
                expandedArgs.push(matches[1], matches[2]);
            } else {
                expandedArgs.push(arg);
            }
        });
        argv = expandedArgs;
    }

    /* expand getopt-style combined options */
    var combinedArg = option.combined;
    var hasGetopt = argv.some(combinedArg.test.bind(combinedArg));
    if (hasGetopt){
        findReplace(argv, combinedArg.re, function(arg){
            arg = arg.slice(1);
            return arg.split("").map(function(letter){
                return "-" + letter;
            });
        });
    }    

    /* validate input */
    var invalidMessage = this.definitions.validate(argv);
    if (invalidMessage){
        throw Error(invalidMessage);
    }

    /* create output initialised with default values */
    var output = this.definitions.createOutput();
    var def;
    
    /* walk argv building the output */
    argv.forEach(function(item){
        if (option.isOption(item)){
            def = self.definitions.get(item);
            if (!t.isDefined(output[def.name])) outputSet(output, def.name, def.getInitialValue())
            if (def.isBoolean()) {
                outputSet(output, def.name, true);
                def = null;
            }

        } else {
            var value = item;
            if (!def){
                def = self.definitions.getDefault();
                if (!def) return;
                if (!t.isDefined(output[def.name])) outputSet(output, def.name, def.getInitialValue());
            }

            var outputValue = def.type ? def.type(value) : value;
            outputSet(output, def.name, outputValue);

            if (!def.multiple) def = null;
        }
    });

    /* group the output values */
    if (this.definitions.isGrouped()){
        var grouped = {
            _all: output,
        };

        this.definitions.whereGrouped().forEach(function(def){
            a.arrayify(def.group).forEach(function(groupName){
                grouped[groupName] = grouped[groupName] || {};
                if (t.isDefined(output[def.name])){
                    grouped[groupName][def.name] = output[def.name];
                }
            });
        });

        this.definitions.whereNotGrouped().forEach(function(def){
            if (t.isDefined(output[def.name])){
                if (!grouped._none) grouped._none = {};
                grouped._none[def.name] = output[def.name];
            }
        });
        return grouped;
    } else {
        return output;
    }
};

/**
@param [options] {module:usage-options}
@returns {string}
*/
CliArgs.prototype.getUsage = function(options){
    return cliUsage(this.definitions.val(), options);
};

function outputSet(output, property, value){
    if (Array.isArray(output[property])){
        output[property].push(value);
    } else {
        output[property] = value;
    }
};
