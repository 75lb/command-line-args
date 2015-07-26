var cliArgs = require("../");
var testValue = require("test-value");
var fs = require("fs");

var cli = cliArgs([
    { name: "help", type: Boolean },
    { name: "files", type: String, multiple: true, defaultOption: true },
    { name: "log-level", type: String }
]);

var options = cli.parse();

var validForms = {};

validForms.main = {
    files: function(files){
        return files && files.every(fs.existsSync);
    },
    "log-level": [ "info", "warn", "error", null, undefined ]
};

validForms.help = {
    help: true
};

var valid = testValue(options, [ validForms.main, validForms.help ]);

console.log(valid, options);
