var test = require("tape");
var cliArgs = require("../");

test("required: throws on missing required value", function(t){
    var cliOptions = [
        { name: "one" },
        { name: "two", required: true }
    ];
    var argv = [ "--one", "what" ];
    t.throws(function(){
        var result = cliArgs(cliOptions).parse(argv);
    }, /invalid/i);
    t.end();
});

test("required: does not throw when required value supplied", function(t){
    var cliOptions = [
        { name: "one" },
        { name: "two", required: true }
    ];
    var argv = [ "--one", "what", "--two" ];
    t.doesNotThrow(function(){
        var result = cliArgs(cliOptions).parse(argv);
    });
    t.end();
});

test("required: does not throw with default value", function(t){
    var cliOptions = [
        { name: "one" },
        { name: "two", required: true, value: 2 }
    ];
    var argv = [ "--one", "what" ];
    t.doesNotThrow(function(){
        var result = cliArgs(cliOptions).parse(argv);
    });
    t.end();
});

test("required: throws on empty array", function(t){
    var cliOptions = [
        { name: "one" },
        { name: "two", required: true, value: [] }
    ];
    var argv = [ "--one", "what" ];
    t.throws(function(){
        var result = cliArgs(cliOptions).parse(argv);
    }, /invalid/i);
    t.end();
});
