var test = require("tape");
var cliArgs = require("../");


test("bad input: throws when no definition.name specified", function(t){
    var optionDefinitions = [
        { something: "one" },
        { something: "two" },
    ];
    var argv = [ "--one", "--two" ];
    t.throws(function(){
        var result = cliArgs(optionDefinitions).parse(argv);
    }, /invalid/i);
    t.end();
});

test("bad input: handles missing option value", function(t){
    var optionDefinitions = [
        { name: "colour", type: String },
        { name: "files" }
    ];
    t.deepEqual(cliArgs(optionDefinitions).parse([ "--colour" ]), {
    	colour: null
    });
    t.deepEqual(cliArgs(optionDefinitions).parse([ "--colour", "--files", "yeah" ]), {
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
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
    	colours: [ "../what", "../ever" ]
    });
    t.end();
});
