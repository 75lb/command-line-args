var w = require("wodge");

module.exports = parse;

/**
docs TODO
*/
function parse(optionDefinitions, argv){
    var shortArg = /^-\w/,
        longArg = /^--\w+/,
        output = {},
        defaultValues = [],
        arg;
    
    argv = argv ? argv.slice(0) : process.argv.slice(2);
    
    function setOutput(optionDefinition){
        if (optionDefinition){
            if(optionDefinition.type === "boolean" || optionDefinition.type === Boolean){
                output[optionDefinition.name] = true;
            } else if (argv.length) {
                if (typeof optionDefinition.type === "function"){
                    output[optionDefinition.name] = optionDefinition.type(argv.shift());
                } else {
                    output[optionDefinition.name] = argv.shift();
                }
            } else {
                throw new Error("weird case");
            }
        } else {
            throw new Error("Unexpected option: " + optionName);
        }
    };
    
    while (typeof(arg = argv.shift()) !== "undefined"){
        if (longArg.test(arg)){
            var optionName = arg.replace(/^--/, "");
            var optionDefinition = w.findWhere(optionDefinitions, { name: optionName });
            setOutput(optionDefinition);
        } else if (shortArg.test(arg)){
            var optionName = arg.replace(/^-/, "");
            var optionDefinition = w.findWhere(optionDefinitions, { alias: optionName });
            setOutput(optionDefinition);
        
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
