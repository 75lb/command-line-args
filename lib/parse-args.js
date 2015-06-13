"use strict";
var a = require("array-tools");
var util = require("util");

/**
@module parse-args
*/
module.exports = parseArgs;

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
function parseArgs(argDefinitions, argv){
    argDefinitions = a(argDefinitions);
    var argDefinition;
    return argv.reduce(function(output, item){
        if (shortArg.test(item) || longArg.test(item)){
            var arg = item;
            argDefinition = shortArg.test(arg)
                ? argDefinitions.findWhere({ alias: shortArg.name(arg) })
                : argDefinitions.findWhere({ name: longArg.name(arg) });
            if (argDefinition.type === Boolean){
                output[argDefinition.name] = true;
            } else if (argDefinition.multiple){
                output[argDefinition.name] = [];
            }
        } else {
            var value = item;
            if (!argDefinition) throw Error(util.format("invalid argv [%s]", JSON.stringify(argv)));
            if (Array.isArray(output[argDefinition.name])){
                output[argDefinition.name].push(argDefinition.type(value));
            } else {
                output[argDefinition.name] = argDefinition.type(value);
            }
        }
        return output;
    }, {});
}
