var test = require("tape");
var cliArgs = require("../lib/command-line-args");

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
            cliArgs(optionDefinitions).parse(argv);
        }, 
        new Error("Unexpected option: f")
    );
    t.end();
});

test("handles missing option value", function(t){
    var argv = [ "--colour" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
    	colour: null
    });
    t.end();
});

test("handles missing option value", function(t){
    var argv = [ "--colour", "--number", "2" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
    	colour: null,
		number: 2
    });
    t.end();
});

test("handles arrays with relative paths", function(t){
    var argv = [ "--colours", "../what", "../ever" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
    	colours: [ "../what", "../ever" ]
    });
    t.end();
});
