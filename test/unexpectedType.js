var test = require("tape");
var cliArgs = require("../lib/command-line-args");

var optionDefinitions = [];

test("unexpected type: throws", function(t){
    var argv = [ "--clive", "hater" ];
    t.throws(function(){
        cliArgs(optionDefinitions).parse(argv);
    });
    t.end();
});

test("unexpected type: string", function(t){
    var argv = [ "--clive", "hater" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv, { unexpectedType: "string" }), {
        clive: "hater"
    });
    
    t.end();
});

test("unexpected type: string, no value", function(t){
    var argv = [ "--clive", "--nigeria" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv, { unexpectedType: "string" }), {
        clive: null,
        nigeria: null
    });
    
    t.end();
});
