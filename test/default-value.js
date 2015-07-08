var test = require("tape");
var cliArgs = require("../");

test("default value", function(t){
    t.deepEqual(cliArgs([ { name: "one" }, { name: "two", value: "two" } ]).parse([ "--one", "1" ]), {
        one: "1",
        two: "two"
    });
    t.deepEqual(cliArgs([{ name: "two", value: "two" }]).parse([]), {
        two: "two"
    });
    t.deepEqual(cliArgs([{ name: "two", value: "two" }]).parse([ "--two", "zwei" ]), {
        two: "zwei"
    });
    t.deepEqual(cliArgs([{ name: "two", multiple: true, value: ["two", "zwei"] }]).parse([ ]), {
        two: [ "two", "zwei" ]
    });
    t.deepEqual(
        cliArgs([{ name: "two", multiple: true, value: ["two", "zwei"] }]).parse([ "--two", "duo" ]), 
        { two: [ "two", "zwei", "duo" ] }
    );
    t.end();
});
