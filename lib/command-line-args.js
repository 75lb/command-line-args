var w = require("wodge");

module.exports = parse;

/**
docs TODO
*/
function parse(optionDefinitions, argv){
    var shortArg = /^-(\w)/,
        longArg = /^--(\w+)/,
        output = {},
        defaultValues = [],
        arg;
    
    argv = argv ? argv.slice(0) : process.argv.slice(2);
    
    function setOutput(optionName){
        var option = w.findWhere(optionDefinitions, { name: optionName }) 
                  || w.findWhere(optionDefinitions, { alias: optionName });
        if (option){
            if(option.type === Boolean){
                output[option.name] = true;
            } else if (argv.length) {
                if (typeof option.type === "function"){
                    if (option.type === Array){
                        output[option.name] = spliceWhile(argv, /^\w+/);
                    } else {
                        output[option.name] = option.type(argv.shift());
                    }
                } else {
                    output[option.name] = argv.shift();
                }
            } else {
                console.error(option);
                throw new Error("weird case");
            }
        } else {
            throw new Error("Unexpected option: " + optionName);
        }
    };
    
    while (typeof(arg = argv.shift()) !== "undefined"){
        if (longArg.test(arg)){
            setOutput(arg.match(longArg)[1]);
        } else if (shortArg.test(arg)){
            setOutput(arg.match(shortArg)[1]);
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

function spliceWhile(array, test){
    for (var i = 0; i < array.length; i++){
        if (!test.test(array[i])) break;
    }
    return array.splice(0, i);
}

// var a = [ "--colours", "green", "red", "yellow", "--tramps", "mike", "colin" ];
// // a.shift();
// console.dir(spliceWhile(a, /^\w+/))