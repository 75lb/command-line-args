var w = require("wodge");

exports.parse = parse;
exports.usage = usage

/**
docs TODO
*/
function parse(options, argv, group){
    var shortArg = /^-(\w)/,
        longArg = /^--(\w+)/,
        output = {},
        defaultValues = [],
        arg;

    argv = argv ? argv.slice(0) : process.argv.slice(2);

    if (options.every(function(option){ return "group" in option; })){
        var allOptions = options.reduce(function(prev, curr){
            return prev.concat(curr.options);
        }, []);
        options.forEach(function(group){
            var groupValues = parse(allOptions, argv, group);
            if (groupValues && Object.keys(groupValues).length){
                output[group.group] = groupValues;
            }
        });
        return output
    }

    function setOutputValue(option, value){
        if (group){
            if (w.exists(group.options, option)){
                output[option.name] = value;
            }
        } else {
            output[option.name] = value;
        }
    }

    function setOutput(optionName){
        var option = w.findWhere(options, { name: optionName })
                  || w.findWhere(options, { alias: optionName });
        if (option){
            if(option.type === Boolean){
                setOutputValue(option, true);
            } else if (argv.length) {
                if (typeof option.type === "function"){
                    if (option.type === Array){
                        setOutputValue(option, spliceWhile(argv, /^\w+/));
                    } else {
                        setOutputValue(option, option.type(argv.shift()));
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

    /* set defaults */
    var optionsWithDefault = options.filter(function(option){
        return option.value;
    });
    optionsWithDefault.forEach(function(option){
        output[option.name] = option.value;
    });

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
        var defaultOption = w.findWhere(options, { defaultOption: true });
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

function usage(options){
    return "";
}