var test = require("tape");
var cliArgs = require("../lib/command-line-args");

var optionDefinitions = [
    {
        groups: "group1",
        options: [
            { name: "verbose", alias: "v", type: Boolean },
            { name: "dry", alias: "d", type: Boolean },
            { name: "colour", alias: "c" }
        ]
    },
    {
        groups: "group2",
        options: [
            { name: "number", alias: "n", type: Number },
            { name: "files", defaultOption: true },
            { name: "colours", type: Array },
            { name: "tramps", type: Array }
        ]
    }
];

var optionDefinitions2 = [
    {
        groups: ["group1", "all"],
        options: [
            { name: "verbose", alias: "v", type: Boolean },
            { name: "dry", alias: "d", type: Boolean },
            { name: "colour", alias: "c" }
        ]
    },
    {
        groups: ["group2", "all"],
        options: [
            { name: "number", alias: "n", type: Number },
            { name: "files", defaultOption: true },
            { name: "colours", type: Array },
            { name: "tramps", type: Array }
        ]
    }
];

// test("grouping, one boolean", function(t){
//     var argv = [ "--verbose" ];
//     t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
//         group1: {
//             verbose: true
//         },
//         group2: {}
//     });
//     t.end();
// });
// 
// test("one boolean, one string", function(t){
//     var argv = [ "--verbose", "--colour", "red" ];
//     t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
//         group1: {
//             verbose: true,
//             colour: "red"
//         },
//         group2: {}
//     });
//     t.end();
// });
// 
// test("one boolean, one string, one number", function(t){
//     var argv = [ "--verbose", "--colour", "red", "--number", "3" ];
//     var result = cliArgs(optionDefinitions).parse(argv);
//     t.equal(result.group1.verbose, true);
//     t.equal(result.group1.colour, "red");
//     t.equal(result.group2.number, 3);
//     t.end();
// });
// 
// test("one array", function(t){
//     var argv = [ "--colours", "green", "red", "yellow" ];
//     var result = cliArgs(optionDefinitions).parse(argv);
//     t.deepEqual(result, {
//         group1: {},
//         group2: {
//             colours: [ "green", "red", "yellow" ]
//         }
//     });
//     t.end();
// });
// 
// test("two arrays", function(t){
//     var argv = [ "--colours", "green", "red", "yellow", "--tramps", "mike", "colin" ];
//     var result = cliArgs(optionDefinitions).parse(argv);
//     t.deepEqual(result, {
//         group1: {},
//         group2: {
//             colours: [ "green", "red", "yellow" ],
//             tramps: [ "mike", "colin" ]
//         }
//     });
//     t.end();
// });

test("multi-grouping, one boolean", function(t){
    var argv = [ "--verbose" ];
    t.deepEqual(cliArgs(optionDefinitions2).parse(argv), {
        group1: {
            verbose: true
        },
        group2: {},
        all: {
            verbose: true
        }
    });
    t.end();
});
