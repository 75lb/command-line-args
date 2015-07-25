"use strict";
var cliOptions = require("./typical");
var cliArgs = require("../");
var testValue = require("test-value");
var fs = require("fs");

var cli = cliArgs(cliOptions);
var options = cli.parse();

function validFiles(files){
    return files.every(fs.existsSync);
}

var valid = testValue(options, { files: validFiles });

console.log(valid);
