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
        console.log(arg);
        
        if (longArg.test(arg)){
            let propertyName = arg.replace(longArg, "");
            if (propertyName in expectArgs){
                if(expectArgs[propertyName].type === "boolean"){
                    output[propertyName] = true;
                } else if (arrayItems.length) {
                    target.set(property, arrayItems.shift());
                }
            } else {
                throw new Error("Unexpected argument: " + propertyName);
            }
        }
    }
}

