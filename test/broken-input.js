var test = require("tap").test;
var parse = require("../lib/command-line-args");

var expectArgs = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true }
];

// test("boolean flag option doesn't exist", function(t){
//     var argv = [ "-verbose" ];
// });
