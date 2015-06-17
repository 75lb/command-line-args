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
function parse(definitions, argv){
    definitions = a(definitions);
    argv = a.arrayify(argv);
    
    /* validate input */
    var invalidMessage = validate(definitions, argv);
    if (invalidMessage){
        throw Error(invalidMessage);
    }
    
    var output = applyDefinitionDefaults(definitions);
    
    var def;
    return argv.reduce(function(output, item){
        if (option.isOption(item)){
            var arg = item;
            def = getDefinition(definitions, arg);
            setDefaultOptionValue(def, output);

        } else {
            var value = item;
            if (!def){
                def = getDefaultDefinition(definitions);
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
}

function getDefinition(definitions, arg){
    return option.short.test(arg)
        ? definitions.findWhere({ alias: option.short.name(arg) })
        : definitions.findWhere({ name: option.long.name(arg) });
}

function getDefaultDefinition(definitions){
    return definitions.findWhere({ defaultOption: true });
}

function setDefaultOptionValue(def, output){
    if (def.multiple){
        output[def.name] = [];
    } else if (def.type === Boolean || !def.type){
        output[def.name] = true;
    } else {
        output[def.name] = null;
    }
}

function validate(definitions, argv){
    var someHaveNoName = definitions.some(function(def){
        return !def.name;
    });
    if (someHaveNoName){
        return "Invalid option definitions: the `name` property is required on each definition";
    }

    var someDontHaveFunctionType = definitions.some(function(def){
        return def.type && typeof def.type !== "function";
    });
    if (someDontHaveFunctionType){
        return "Invalid option definitions: the `type` property must be a setter fuction (default: `Boolean`)";
    }
    
    var invalidOption;
    var optionWithoutDefinition = a(argv).where(option.isOption.bind(option)).exists(function(arg){
        if (getDefinition(definitions, arg) === undefined){
            invalidOption = arg;
            return true;
        }
    });
    if (optionWithoutDefinition){
        return "Invalid option: " + invalidOption;
    }
}

function applyDefinitionDefaults(definitions){
    var output = {};
    definitions.forEach(function(def){
        if (def.value) output[def.name] = def.value;
    });
    return output;
}
