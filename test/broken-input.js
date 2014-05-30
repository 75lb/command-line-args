var test = require("tap").test;
var parse = require("../lib/command-line-args").parse;

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true },
    { name: "colours", type: Array },
    { name: "tramps", type: Array }
];

test("throws on unrecognised option", function(t){
    var argv = [ "-files", "clive" ];
    t.throws(
        function(){
            parse(optionDefinitions, argv)
        }, 
        new Error("Unexpected option: f"), 
        "throw test"
    );
    t.end();
});
