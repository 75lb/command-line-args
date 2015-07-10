var test = require("tape");
var cliArgs = require("../");

var cliOptions = [
    { name: "one" },
    { name: "two", required: true }
];

test("required: throws", function(t){
    var argv = [ "--one", "what" ];
    t.throws(function(){
        var result = cliArgs(cliOptions).parse(argv);
    }, /invalid/i);
    t.end();
});

test("required: does not throw", function(t){
    var argv = [ "--one", "what", "--two" ];
    t.doesNotThrow(function(){
        var result = cliArgs(cliOptions).parse(argv);
    });
    t.end();
});
