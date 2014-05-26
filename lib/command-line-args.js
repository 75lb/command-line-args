var w = require("wodge");

module.exports = parse;

/**
@returns {Object}
*/
function parse(optionDefinitions, argv){
    var shortArg = /^-\w/,
        longArg = /^--\w+/,
        output = {},
        defaultValues = [],
        arg;
    
    argv = argv || process.argv.slice(2);
    
    while (typeof(arg = argv.shift()) !== "undefined"){
        if (longArg.test(arg)){
            var optionName = arg.replace(/^--/, "");
            var optionDefinition = w.findWhere(optionDefinitions, { name: optionName });
            if (optionDefinition){
                if(optionDefinition.type === "boolean" || optionDefinition.type === Boolean){
                    output[optionDefinition.name] = true;
                } else if (argv.length) {
                    output[optionDefinition.name] = argv.shift();
                } else {
                    throw new Error("weird case");
                }
            } else {
                throw new Error("Unexpected option: " + optionName);
            }
        } else if (shortArg.test(arg)){
            var optionName = arg.replace(/^-/, "");
            var optionDefinition = w.findWhere(optionDefinitions, { alias: optionName });
            if (optionDefinition){
                if(optionDefinition.type === "boolean" || optionDefinition.type === Boolean){
                    output[optionDefinition.name] = true;
                } else if (argv.length) {
                    output[optionDefinition.name] = argv.shift();
                } else {
                    throw new Error("weird case");
                }
            } else {
                throw new Error("Unexpected option: " + optionName);
            }
        
        } else {
            defaultValues.push(arg);
        }
    }
    
    if (defaultValues.length > 0){
        var defaultOption = w.findWhere(optionDefinitions, { defaultOption: true });
        if (defaultOption){
            if (defaultOption.type === Array){
                if (Array.isArray(output[defaultOption.name])){
                    output[defaultOption.name] = output[defaultOption.name].concat(defaultValues);
                } else {
                    output[defaultOption.name] = defaultValues;
                }
            } else {
                output[defaultOption.name] = defaultValues[0];
            }
        }
    }
    
    return output;
}
