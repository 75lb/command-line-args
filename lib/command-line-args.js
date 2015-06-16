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

var option = {
    short: new Arg(/^-(\w)/),
    long: new Arg(/^--([\w-]+)/),
    isOption: function(arg){
        return this.short.test(arg) || this.long.test(arg);
    }
};

/**
@param {module:parse-args.argDefType}
@param {string[]}
@returns {object}
@alias {module:parse-args}
*/
function parse(optionDefinitions, argv){
    optionDefinitions = a(optionDefinitions);
    
    /* validate input */
    var invalidMessage = validate(optionDefinitions, argv);
    if (invalidMessage){
        throw Error(invalidMessage);
    }
    
    var optionDefinition;
    return argv.reduce(function(output, item){
        if (option.isOption(item)){
            var arg = item;
            optionDefinition = getOptionDefinition(optionDefinitions, arg);
            
            /* Boolean is the default type, if not specified */    
            optionDefinition.type = optionDefinition.type || Boolean;
            
            /* set default values */
            if (optionDefinition.type === Boolean){
                output[optionDefinition.name] = true;
            } else if (optionDefinition.multiple){
                output[optionDefinition.name] = [];
            } else {
                output[optionDefinition.name] = null;
            }
            
        } else {
            var value = item;

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

function getOptionDefinition(optionDefinitions, arg){
    return option.short.test(arg)
        ? optionDefinitions.findWhere({ alias: option.short.name(arg) })
        : optionDefinitions.findWhere({ name: option.long.name(arg) });
}

function validate(optionDefinitions, argv){
    var someHaveNoName = optionDefinitions.some(function(def){
        return !def.name;
    });
    if (someHaveNoName){
        return "Invalid option definitions: the `name` property is required on each definition";
    }

    var someDontHaveFunctionType = optionDefinitions.some(function(def){
        return def.type && typeof def.type !== "function";
    });
    if (someDontHaveFunctionType){
        return "Invalid option definitions: the `type` property must be a setter fuction (default: `Boolean`)";
    }
    
    var invalidOption;
    var optionWithoutDefinition = a(argv).where(option.isOption.bind(option)).exists(function(arg){
        if (getOptionDefinition(optionDefinitions, arg) === undefined){
            invalidOption = arg;
            return true;
        }
    });
    if (optionWithoutDefinition){
        return "Invalid option: " + invalidOption;
    }
}
