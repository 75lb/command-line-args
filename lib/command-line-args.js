var w = require("wodge"),
    util = require("util"),
    Design = require("nature").Design;

module.exports = CliArgs;

function CliArgs(options){
    if (!(this instanceof CliArgs)) return new CliArgs(options);
    
    options.forEach(function(option){
        if (option.options) option.attributes = option.options;
    });
    Design.call(this, options);
}
util.inherits(CliArgs, Design);

CliArgs.prototype.parse = function(argv){
    var shortArg = /^-(\w)/,
        longArg = /^--([\w-]+)/,
        model = this.create(),
        defaultValues = [],
        self = this,
        arg;

    argv = argv ? argv.slice(0) : process.argv.slice(2);
    
    function setOutputValue(option, value){
        model[option.name] = value;
    }

    function setOutput(optionName){
        var option = w.findWhere(self._attributes, { name: optionName })
                  || w.findWhere(self._attributes, { alias: optionName });
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
                    setOutputValue(option, argv.shift());
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
        var defaultOption = w.findWhere(this._attributes, { defaultOption: true });
        if (defaultOption){
            if (defaultOption.type === Array){
                if (Array.isArray(model[defaultOption.name])){
                    model[defaultOption.name] = model[defaultOption.name].concat(defaultValues);
                } else {
                    model[defaultOption.name] = defaultValues;
                }
            } else {
                model[defaultOption.name] = defaultValues[0];
            }
        }
    }

    if (this.groups().length){
        var output = {};
        // console.dir(this.groups())
        this.groups().forEach(function(groupName){
            var filter = "return attribute.groups && attribute.groups.indexOf('" + groupName + "') > -1;";
            // console.dir(self.where(filter, model))
            var optionGroup = w.defined(self.where(filter, model));
            output[groupName] = optionGroup;
        });
        return output;
    } else {
        return w.defined(model);
    }
};

CliArgs.prototype.usage = function(options){
    return "";
};

function spliceWhile(array, test){
    for (var i = 0; i < array.length; i++){
        if (!test.test(array[i])) break;
    }
    return array.splice(0, i);
}
