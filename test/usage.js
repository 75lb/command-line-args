var test = require("tap").test;
var usage = require("../lib/command-line-args").usage;

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true }
];

test("usage", function(t){
    t.equal(typeof usage(optionDefinitions), "string");
    t.end();
});
