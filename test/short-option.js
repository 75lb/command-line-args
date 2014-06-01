var test = require("tap").test;
var cliArgs = require("../lib/command-line-args");

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true }
];

test("short: one boolean", function(t){
    var argv = [ "-v" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        verbose: true
    });
    t.end();
});

test("short: one boolean, one string", function(t){
    var argv = [ "-v", "-c", "red" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        verbose: true,
        colour: "red"
    });
    t.end();
});
