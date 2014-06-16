var a = require("array-tools"),
    o = require("object-tools"),
    util = require("util"),
    Design = require("nature").Design,
    handlebars = require("handlebars"),
    fs = require("fs"),
    path = require("path");

module.exports = CliArgs;

require("../template/helpers/columns")(handlebars);
require("handlebars-ansi")(handlebars);
handlebars.registerPartial("columns", fs.readFileSync(path.resolve(__dirname, "..", "template", "partials", "columns.hbs"), "utf8"));
handlebars.logger.level = 1;

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
    
	function isOption(input){
		return longArg.test(input) || shortArg.test(input);
	}
	
    function setOutputValue(option, value){
        model[option.name] = value;
    }

    function setOutput(optionName){
        var option = a.findWhere(self._attributes, { name: optionName })
                  || a.findWhere(self._attributes, { alias: optionName });
        if (option){
            if(option.type === Boolean){
                setOutputValue(option, true);
            } else if (argv.length) {
				var value;
                if (typeof option.type === "function" && option.type === Array){
	                value = a.spliceWhile(argv, 0, /^\w+/);
				} else {
					if (isOption(argv[0])){
						value = null;
					} else {
						value = argv.shift();
						value = typeof option.type === "function" ? option.type(value) : value;
					}
				}
				setOutputValue(option, value);
			} else {
				setOutputValue(option, null);
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
        var defaultOption = a.findWhere(this._attributes, { defaultOption: true });
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
        this.groups().forEach(function(groupName){
            var filter = "return attribute.groups && attribute.groups.indexOf('" + groupName + "') > -1;";
            var optionGroup = o.defined(self.where(filter, model));
            output[groupName] = optionGroup;
        });
        return output;
    } else {
        return o.defined(model);
    }
};

CliArgs.prototype.usage = function(data){
    var self = this;
    data = data || {};
    var template = fs.readFileSync(path.resolve(__dirname, "..", "template", "usage.hbs"), "utf8");
    data.options = this._attributes.map(function(option){
        option.nameAndAlias = (option.alias ? "-" + option.alias + ", " : "") + "--" + option.name;
        return option;
    });
    data.groups = this.groups().map(function(group){
        return {
            name: group,
            options: self._attributes.filter(function(option){
                return option.groups && option.groups.indexOf(group) > -1;
            })
        }
    });
    return handlebars.compile(template)(data);
};
