var test = require("tape");
var cliArgs = require("../lib/command-line-args");

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true }
];

test("one of each", function(t){
    var argv = [ "--verbose", "-d", "--colour", "red", "--number", 3 ];
    var result = cliArgs(optionDefinitions).parse(argv);
    t.equal(result.verbose, true);
    t.equal(result.dry, true);
    t.equal(result.colour, "red");
    t.equal(result.number, 3);
    t.end();
});
