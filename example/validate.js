"use strict";
var cliOptions = require("./typical");
var cliArgs = require("../");
var testValue = require("test-value");
var fs = require("fs");

var cli = cliArgs(cliOptions);
var options = cli.parse();

var validMainForm = {
    files: function(files){
        return files && files.every(fs.existsSync);
    },
    "log-level": [ "info", "warn", "error", null, undefined ]
};

var validHelpForm = {
    help: true
};

var valid = testValue(options, [ validMainForm, validHelpForm ]);

console.log(valid, options);
