"use strict";
var a = require("array-tools");
var util = require("util");
var option = require("./option");

/**
@module definitions
*/
module.exports = Definitions;

function Definitions(definitions){
    a.call(this, definitions);
}
util.inherits(Definitions, a);

Definitions.prototype.validate = function(argv){
    var self = this;
    var someHaveNoName = this.some(function(def){
        return !def.name;
    });
    if (someHaveNoName){
        return "Invalid option definitions: the `name` property is required on each definition";
    }

    var someDontHaveFunctionType = this.some(function(def){
        return def.type && typeof def.type !== "function";
    });
    if (someDontHaveFunctionType){
        return "Invalid option definitions: the `type` property must be a setter fuction (default: `Boolean`)";
    }
    
    var invalidOption;
    var optionWithoutDefinition = a(argv).where(option.isOption.bind(option)).exists(function(arg){
        if (self.get(arg) === undefined){
            invalidOption = arg;
            return true;
        }
    });
    if (optionWithoutDefinition){
        return "Invalid option: " + invalidOption;
    }
};

Definitions.prototype.applyDefaults = function(){
    var output = {};
    this.forEach(function(def){
        if (def.value) output[def.name] = def.value;
    });
    return output;
};

Definitions.prototype.get = function(arg){
    return option.short.test(arg)
        ? this.findWhere({ alias: option.short.name(arg) })
        : this.findWhere({ name: option.long.name(arg) });
};

Definitions.prototype.getDefault = function(){
    return this.findWhere({ defaultOption: true });
};
