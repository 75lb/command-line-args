var test = require("tape");
var cliArgs = require("../");

test("default value", function(t){
    t.deepEqual(cliArgs([ { name: "one" }, { name: "two", defaultValue: "two" } ]).parse([ "--one", "1" ]), {
        one: "1",
        two: "two"
    });
    t.deepEqual(cliArgs([{ name: "two", defaultValue: "two" }]).parse([]), {
        two: "two"
    });
    t.deepEqual(cliArgs([{ name: "two", defaultValue: "two" }]).parse([ "--two", "zwei" ]), {
        two: "zwei"
    });
    t.deepEqual(cliArgs([{ name: "two", multiple: true, defaultValue: ["two", "zwei"] }]).parse([ ]), {
        two: [ "two", "zwei" ]
    });
    t.deepEqual(
        cliArgs([{ name: "two", multiple: true, defaultValue: ["two", "zwei"] }]).parse([ "--two", "duo" ]), 
        { two: [ "two", "zwei", "duo" ] }
    );
    t.end();
});
