"use strict";
var a = require("array-tools");
var util = require("util");

/**
@module parse-args
*/
module.exports = parse;

function Arg(re){
    this.re = re;
}
Arg.prototype.name = function(arg){
    return arg.match(this.re)[1];
};
Arg.prototype.test = function(arg){
    return this.re.test(arg);
};

var shortArg = new Arg(/^-(\w)/);
var longArg = new Arg(/^--([\w-]+)/);

/**
@param {module:parse-args.argDefType}
@param {string[]}
@returns {object}
@alias {module:parse-args}
*/
function parse(optionDefinitions, argv){
    optionDefinitions = a(optionDefinitions);
    
    /* validate input */
    var someHaveNoName = optionDefinitions.some(function(def){
        return !def.name;
    });
    if (someHaveNoName){
        throw Error("Invalid input: the `name` property is required on all option definitions");
    }
    
    var optionDefinition;
    return argv.reduce(function(output, item){
        if (shortArg.test(item) || longArg.test(item)){
            var arg = item;
            optionDefinition = shortArg.test(arg)
                ? optionDefinitions.findWhere({ alias: shortArg.name(arg) })
                : optionDefinitions.findWhere({ name: longArg.name(arg) });
                
            /* special default values, Boolean, multiple or no-type */
            if (optionDefinition.type === Boolean){
                output[optionDefinition.name] = true;
            } else if (optionDefinition.multiple){
                output[optionDefinition.name] = [];
            } else if (!optionDefinition.type){
                output[optionDefinition.name] = true;
            }
        } else {
            var value = item;
            if (!optionDefinition) throw Error(util.format("invalid argv [%s]", JSON.stringify(argv)));
            if (Array.isArray(output[optionDefinition.name])){
                output[optionDefinition.name].push(optionDefinition.type(value));
            } else {
                if (optionDefinition.type){
                    output[optionDefinition.name] = optionDefinition.type(value);
                } else {
                    output[optionDefinition.name] = value;
                }
            }
        }
        return output;
    }, {});
}
