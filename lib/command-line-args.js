var w = require("wodge");

module.exports = parse;

/**
@returns {Object}
*/
function parse(optionDefinitions, argv){
    var shortArg = /-\w/,
        longArg = /--\w+/,
        output = {},
        arg;

    argv = argv === process.argv ? argv.slice(2) : argv.slice(0);
    
    while (typeof(arg = argv.shift()) !== "undefined"){
        // console.log(arg);
        
        if (longArg.test(arg)){
            var optionName = arg.replace("--", "");
            var optionDefinition = w.findWhere(optionDefinitions, { name: optionName });
            if (optionDefinition){
                if(optionDefinition.type === "boolean" || optionDefinition.type instanceof Boolean){
                    output[optionName] = true;
                } else if (argv.length) {
                    output[optionName] = argv.shift();
                } else {
                    console.dir(output);
                    console.dir(optionDefinition);
                    console.dir(arg);
                    console.dir(optionName);
                    throw new Error("weird case");
                }
            } else {
                console.dir(output);
                console.dir(optionDefinitions);
                console.dir(arg);
                console.dir(optionName);
                throw new Error("Unexpected option: " + optionName);
            }
        }
    }
    
    return output;
}
