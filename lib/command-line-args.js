var w = require("wodge");

module.exports = parse;

/**
@returns {Object}
*/
function parse(optionDefinitions, argv){
    var shortArg = /^-\w/,
        longArg = /^--\w+/,
        output = {},
        arg;

    argv = argv === process.argv ? argv.slice(2) : argv.slice(0);
    
    while (typeof(arg = argv.shift()) !== "undefined"){
        if (longArg.test(arg)){
            var optionName = arg.replace(/^--/, "");
            var optionDefinition = w.findWhere(optionDefinitions, { name: optionName });
            if (optionDefinition){
                if(optionDefinition.type === "boolean" || optionDefinition.type === Boolean){
                    output[optionName] = true;
                } else if (argv.length) {
                    output[optionName] = argv.shift();
                } else {
                    console.error(output);
                    console.error(optionDefinition);
                    console.error(arg);
                    console.error(optionName);
                    throw new Error("weird case");
                }
            } else {
                console.error(output);
                console.error(optionDefinition);
                console.error(arg);
                console.error(optionName);
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
                    console.error(output);
                    console.error(optionDefinition);
                    console.error(arg);
                    console.error(optionName);
                    throw new Error("weird case");
                }
            } else {
                console.error(output);
                console.error(optionDefinition);
                console.error(arg);
                console.error(optionName);
                throw new Error("Unexpected option: " + optionName);
            }
        
        } else {
            console.error(output);
            console.error(optionDefinition);
            console.error(arg);
            console.error(optionName);
            console.error("DIDndd't match: " + arg)
        }
    }
    
    return output;
}
