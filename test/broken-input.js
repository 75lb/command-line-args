var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "dry", alias: "d", type: Boolean },
    { name: "colour", alias: "c" },
    { name: "number", alias: "n", type: Number },
    { name: "files", defaultOption: true },
    { name: "colours", type: String, multiple: true },
    { name: "tramps", type: String, multiple: true }
];

test("throws on unrecognised option", function(t){
    var argv = [ "-files", "clive" ];
    t.throws(
        function(){
            parse(optionDefinitions, argv);
        }, 
        new Error("Unexpected option: f")
    );
    t.end();
});

test("handles missing option value", function(t){
    var argv = [ "--colour" ];
    t.deepEqual(parse(optionDefinitions, argv), {
    	colour: null
    });
    t.end();
});

test("handles missing option value", function(t){
    var argv = [ "--colour", "--number", "2" ];
    t.deepEqual(parse(optionDefinitions, argv), {
    	colour: null,
		number: 2
    });
    t.end();
});

test("handles arrays with relative paths", function(t){
    var argv = [ "--colours", "../what", "../ever" ];
    t.deepEqual(parse(optionDefinitions, argv), {
    	colours: [ "../what", "../ever" ]
    });
    t.end();
});
