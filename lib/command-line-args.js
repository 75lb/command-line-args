"use strict";
var a = require("array-tools");
var o = require("object-tools");
var util = require("util");
var Definitions = require("./definitions");
var option = require("./option");
var cliUsage = require("command-line-usage");

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

    /* initialise output structure */
    var output = this.definitions.applyInitialValues();
    var def;
    output = argv.reduce(function(output, item){
        if (option.isOption(item)){
            var arg = item;
            def = self.definitions.get(arg);
            output[def.name] = getDefaultOptionValue(def);

        } else {
            var value = item;
            if (!def){
                def = self.definitions.getDefault();
                output[def.name] = getDefaultOptionValue(def);
            }

            var outputValue = def.type ? def.type(value) : value;
            if (Array.isArray(output[def.name])){
                output[def.name].push(outputValue);
            } else {
                output[def.name] = outputValue;
            }
        }
        return output;
    }, output);

    if (this.definitions.isGrouped()){
        var grouped = {
            _all: output,
            _none: o.where(output, { group: undefined })
        };
        // console.log(this.definitions.where({ "!group": undefined }).val());
        this.definitions.where({ "!group": undefined }).forEach(function(def){
            a.arrayify(def.group).forEach(function(groupName){
                grouped[groupName] = grouped[groupName] || {};
                grouped[groupName][def.name] = output[def.name];
            });
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

function getDefaultOptionValue(def, output){
    if (def.multiple){
        return [];
    } else if (def.type === Boolean || !def.type){
        return true;
    } else {
        return null;
    }
}
