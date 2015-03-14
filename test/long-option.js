var test = require("tape");
var cliArgs = require("../lib/command-line-args");

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "colours", type: Array },
    { name: "tramps", type: Array },
    { name: "dry-run", type: Boolean }
];

test("one boolean", function(t){
    var argv = [ "--verbose" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        verbose: true
    });
    
    t.end();
});

test("one boolean, one string", function(t){
    var argv = [ "--verbose", "--colour", "red" ];
    cliArgs(optionDefinitions).parse(argv)
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        verbose: true,
        colour: "red"
    });
    t.end();
});

test("one boolean, one string, one number", function(t){
    var argv = [ "--verbose", "--colour", "red", "--number", "3" ];
    var result = cliArgs(optionDefinitions).parse(argv);
    console.dir(result)
    t.equal(result.verbose, true);
    t.equal(result.colour, "red");
    t.equal(result.number, 3)
    t.end();
});

test("one array", function(t){
    var argv = [ "--colours", "green", "red", "yellow" ];
    var result = cliArgs(optionDefinitions).parse(argv);
    t.deepEqual(result, {
        colours: [ "green", "red", "yellow" ]
    });
    t.end();
});

test("two arrays", function(t){
    var argv = [ "--colours", "green", "red", "yellow", "--tramps", "mike", "colin" ];
    var result = cliArgs(optionDefinitions).parse(argv);
    t.deepEqual(result, {
        colours: [ "green", "red", "yellow" ],
        tramps: [ "mike", "colin" ]
    });
    t.end();
});

test("--this-option", function(t){
    var argv = [ "--dry-run" ];
    var result = cliArgs(optionDefinitions).parse(argv);
    t.deepEqual(result, {
        "dry-run": true
    });
    t.end();
});
