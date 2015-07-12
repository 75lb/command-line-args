#!/usr/bin/env node
"use strict";
var cliArgs = require("../");
var os = require("os");
var fs = require("fs");
var path = require("path");
var ansi = require("ansi-escape-sequences");

var tmpPath = path.join(os.tmpDir(), Date.now() + "-cla.js");

process.stdin
    .pipe(fs.createWriteStream(tmpPath))
    .on("close", parseCla);
    
function parseCla(){
    var cliOptions = require(tmpPath);
    fs.unlinkSync(tmpPath);
    
    var cli = cliArgs(cliOptions);
    try {
        console.log(cli.parse());
    } catch(err){
        halt(err.message);
    }
}

function halt(msg){
    console.error(ansi.format(msg, "red"));
    process.exit(1);
}
