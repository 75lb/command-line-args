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
@param {module:command-line-args.argDefType}
@param {string[]}
@returns {object}
@alias module:command-line-args
*/
function CliArgs(definitions, argv){
    if (!(this instanceof CliArgs)) return new CliArgs(definitions, argv);
    this.definitions = new Definitions(definitions);
}
CliArgs.prototype.parse = function(argv){
    var self = this;
    
    /* if no argv supplied, assume we are parsing process.argv */
    argv = argv || process.argv;
    if (argv === process.argv){
        argv.splice(0, 2);
    } else {
        argv = a.arrayify(argv);
    }

    /* validate input */
    var invalidMessage = this.definitions.validate(argv);
    if (invalidMessage){
        throw Error(invalidMessage);
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

    /* create output initialised with default values */
    var output = this.definitions.createOutput();
    var def;
    
    /* walk argv building the output */
    argv.forEach(function(item){
        if (option.isOption(item)){
            def = self.definitions.get(item);
            if (!t.isDefined(output[def.name])) outputSet(output, def.name, def.getInitialValue())
            if (def.isBoolean()) def = null;

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

    /* check for missing required values */
    var requiredOptions = this.definitions.where({ required: true }).pluck("name").val();
    var missingRequiredOptions = requiredOptions.filter(function(name){
        var outputVal = output[name];
        if (!t.isDefined(outputVal) || (Array.isArray(outputVal) && !outputVal.length) ){
            return name;
        }
    });
    if (missingRequiredOptions.length){
        throw Error("Invalid args. Missing values for these required options: " + missingRequiredOptions
            .map(function(name){
                return "--" + name;
            })
            .join(", "));
    }


    /* group the output values */
    if (this.definitions.isGrouped()){
        var grouped = {
            _all: output,
            _none: {}
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
                grouped._none[def.name] = output[def.name];
            }
        });
        return grouped;
    } else {
        return output;
    }
};

CliArgs.prototype.getUsage = function(options){
    return cliUsage(this.definitions.val(), options);
};

CliArgs.prototype.setUsage = function(usageGenerator){
    cliUsage = usageGenerator;
};

function outputSet(output, property, value){
    if (Array.isArray(output[property])){
        output[property].push(value);
    } else {
        output[property] = value;
    }
};
