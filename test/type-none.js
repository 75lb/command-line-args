var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "one" },
    { name: "two" }
];

test("name: no argv values", function(t){
    var argv = [ ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {});
    t.end();
});

test("name: just names, no values", function(t){
    var argv = [ "--one", "--two" ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        one: true,
        two: true
    });
    t.end();
});

test("name: just names, no values, unpassed value", function(t){
    var argv = [ "--one", "--two" ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        one: true,
        two: true
    });
    t.end();
});

test("name: just names, one value, one unpassed value", function(t){
    var argv = [ "--one", "one", "--two" ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        one: "one",
        two: true
    });
    t.end();
});

test("name: just names, two values", function(t){
    var argv = [ "--one", "one", "--two", "two" ];
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        one: "one",
        two: "two"
    });
    t.end();
});
