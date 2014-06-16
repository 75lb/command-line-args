var test = require("tap").test;
var cliArgs = require("../lib/command-line-args");

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true },
    { form: "basic", description: "$ test <options> <files>" },
    { form: "colour-only", description: "$ test --colour" }
];

// test("returns options", function(t){
//     var usage = cliArgs(optionDefinitions).usage();
//     t.ok(usage.options);
//     t.ok(usage.forms);
//     t.end();
// });
