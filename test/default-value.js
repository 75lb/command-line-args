var test = require("tap").test;
var parse = require("../lib/command-line-args").parse;

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
    t.deepEqual(parse(optionDefinitions, argv), {
        verbose: true,
        colour: "orange"
    });
    t.end();
});
