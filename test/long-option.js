var test = require("tap").test;
var parse = require("../lib/command-line-args");

// require("traceur").require.makeDefault();
// traceur.options.experimental = true;
// var parse = require("../lib/es6.js");

var expectArgs = [
    { name: "verbose", alias: "v", type: "boolean" },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true }
];

test("one boolean", function(t){
    var argv = [ "--verbose" ];
    t.deepEqual(parse(expectArgs, argv), {
        verbose: true
    });
    t.end();
});

// test("one boolean, one string", function(t){
//     var argv = [ "--verbose", "--colour", "red" ];
//     t.deepEqual(parse(expectArgs, argv), {
//         verbose: true,
//         colour: "red"
//     });
//     t.end();
// });
