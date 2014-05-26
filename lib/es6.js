var w = require("wodge");

module.exports = parse;

/**
@returns {Object}
*/
function parse(expectArgs, argv){
    var shortArg = /-\w/,
        longArg = /--\w+/,
        output = {},
        arg;

    argv = argv === process.argv ? argv.slice(2) : argv.slice(0);
    
    while (typeof(arg = argv.shift()) !== "undefined"){
        // console.log(arg);
        
        if (longArg.test(arg)){
            let optionName = arg.replace("--", "");
            if (w.exists(expectArgs, { name: optionName })){
                if(expectArgs[optionName].type === "boolean" || expectArgs[optionName].type instanceof Boolean){
                    output[optionName] = true;
                } else if (argv.length) {
                    output[optionName] = argv.shift();
                } else {
                    console.dir(output);
                    throw new Error("weird case");
                }
            } else {
                console.dir(output);
                console.dir(expectArgs);
                console.dir(arg);
                console.dir(optionName);
                throw new Error("Unexpected option: " + optionName);
            }
        }
    }
    
    return output;
}
