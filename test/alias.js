var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "verbose", alias: "v" },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n" },
    { name: "dry-run", alias: "d" }
];

test("alias: one boolean", function(t){
    var argv = [ "-v" ];
    t.deepEqual(parse(optionDefinitions, argv), {
        verbose: true
    });
    t.end();
});

test("alias: one --this-type boolean", function(t){
    var argv = [ "-d" ];
    t.deepEqual(parse(optionDefinitions, argv), {
        "dry-run": true
    });
    t.end();
});

test("alias: one boolean, one string", function(t){
    var argv = [ "-v", "-c", "red" ];
    t.deepEqual(parse(optionDefinitions, argv), {
        verbose: true,
        colour: "red"
    });
    t.end();
});
