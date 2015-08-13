"use strict";
var a = require("array-tools");
var util = require("util");
var option = require("./option");
var Definition = require("./definition");

/**
@module definitions
@private
*/
module.exports = Definitions;

function Definitions(definitions){
    definitions = a.arrayify(definitions);
    a.call(this, definitions.map(function(def){
        return new Definition(def);
    }));
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

Definitions.prototype.createOutput = function(){
    var output = {};
    this.forEach(function(def){
        if (def.defaultValue) output[def.name] = def.defaultValue;
        if (Array.isArray(output[def.name])){
            output[def.name]._initial = true;
        }
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

Definitions.prototype.isGrouped = function(){
    return this.some(function(def){
        return def.group;
    });
};

Definitions.prototype.whereGrouped = function(){
    return this.where(containsValidGroup).val();
};
Definitions.prototype.whereNotGrouped = function(){
    return this.where(function(def){
        return !containsValidGroup(def);
    }).val();
};

function containsValidGroup(def){
    return a.arrayify(def.group).some(function(group){
        return group;
    });
}
