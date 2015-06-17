var test = require("tape");
var parse = require("../");


test("bad input: throws when no definition.name specified", function(t){
    var optionDefinitions = [
        { something: "one" },
        { something: "two" },
    ];
    var argv = [ "--one", "--two" ];
    t.throws(function(){
        var result = parse(optionDefinitions, argv);
    }, /invalid/i);
    t.end();
});

test("bad input: throws on malformed option", function(t){
    var optionDefinitions = [
        { name: "files" }
    ];
    var argv = [ "-files", "clive" ];
    t.throws(function(){
        parse(optionDefinitions, argv);
    }, /invalid/i);
    t.end();
});

test("bad input: handles missing option value", function(t){
    var optionDefinitions = [
        { name: "colour", type: String },
        { name: "files" }
    ];
    t.deepEqual(parse(optionDefinitions, [ "--colour" ]), {
    	colour: null
    });
    t.deepEqual(parse(optionDefinitions, [ "--colour", "--files", "yeah" ]), {
    	colour: null,
        files: "yeah"
    });
    t.end();
});

test("handles arrays with relative paths", function(t){
    var optionDefinitions = [
        { name: "colours", type: String, multiple: true }
    ];
    var argv = [ "--colours", "../what", "../ever" ];
    t.deepEqual(parse(optionDefinitions, argv), {
    	colours: [ "../what", "../ever" ]
    });
    t.end();
});
