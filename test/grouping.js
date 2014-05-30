var test = require("tap").test;
var parse = require("../lib/command-line-args").parse;

var optionDefinitions = [
    {
        group: "group1",
        options: [
            { name: "verbose", alias: "v", type: Boolean },
            { name: "dry", alias: "d", type: Boolean },
            { name: "colour", alias: "c" }
        ]
    },
    {
        group: "group2",
        options: [
            { name: "number", alias: "n", type: Number },
            { name: "files", defaultOption: true },
            { name: "colours", type: Array },
            { name: "tramps", type: Array }
        ]
    }
];

test("grouping, one boolean", function(t){
    var argv = [ "--verbose" ];
    t.deepEqual(parse(optionDefinitions, argv), {
        group1: {
            verbose: true
        }
    });
    t.end();
});

test("one boolean, one string", function(t){
    var argv = [ "--verbose", "--colour", "red" ];
    t.deepEqual(parse(optionDefinitions, argv), {
        group1: {
            verbose: true,
            colour: "red"
        }
    });
    t.end();
});

test("one boolean, one string, one number", function(t){
    var argv = [ "--verbose", "--colour", "red", "--number", "3" ];
    var result = parse(optionDefinitions, argv);
    t.equal(result.group1.verbose, true);
    t.equal(result.group1.colour, "red");
    t.equal(result.group2.number, 3);
    t.end();
});

test("one array", function(t){
    var argv = [ "--colours", "green", "red", "yellow" ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        group2: {
            colours: [ "green", "red", "yellow" ]
        }
    });
    t.end();
});

test("two arrays", function(t){
    var argv = [ "--colours", "green", "red", "yellow", "--tramps", "mike", "colin" ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        group2: {
            colours: [ "green", "red", "yellow" ],
            tramps: [ "mike", "colin" ]
        }
    });
    t.end();
});
