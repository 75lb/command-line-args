var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "one" },
    { name: "two" }
];

test("just names, no values", function(t){
    var argv = [ "--one", "--two" ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        one: true,
        two: true
    });
    t.end();
});

test("just names, strings", function(t){
    var argv = [ "--one", "one", "--two", "two" ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        one: "one",
        two: "two"
    });
    t.end();
});
