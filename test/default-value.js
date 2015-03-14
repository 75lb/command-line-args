var test = require("tape");
var cliArgs = require("../lib/command-line-args");

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c", value: "orange" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true },
    { name: "colours", type: Array },
    { name: "tramps", type: Array }
];

test("default colour", function(t){
    var argv = [ "--verbose" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        verbose: true,
        colour: "orange"
    });
    t.end();
});
