var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { something: "one" },
    { something: "two" },
];

test("no name specified", function(t){
    var argv = [ "--one", "--two" ];
    t.throws(function(){
        var result = parse(optionDefinitions, argv);
    }, /invalid/i);
    t.end();
});
