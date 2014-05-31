var test = require("tap").test;
var cliArgs = require("../lib/command-line-args");

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true }
];

test("usage", function(t){
    t.equal(typeof cliArgs(optionDefinitions).usage, "string");
    t.end();
});
