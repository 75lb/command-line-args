"use strict";
var a = require("array-tools");
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
    
    var output = this.definitions.applyDefaults();
    
    var def;
    return argv.reduce(function(output, item){
        if (option.isOption(item)){
            var arg = item;
            def = self.definitions.get(arg);
            setDefaultOptionValue(def, output);

        } else {
            var value = item;
            if (!def){
                def = self.definitions.getDefault();
                setDefaultOptionValue(def, output);
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
};

function setDefaultOptionValue(def, output){
    if (def.multiple){
        output[def.name] = [];
    } else if (def.type === Boolean || !def.type){
        output[def.name] = true;
    } else {
        output[def.name] = null;
    }
}
