var test = require("tape");
var parse = require("../");

test("default colour", function(t){
    t.deepEqual(parse([ { name: "one" }, { name: "two", value: "two" } ], [ "--one", "1" ]), {
        one: "1",
        two: "two"
    });
    t.deepEqual(parse([{ name: "two", value: "two" }], []), {
        two: "two"
    });
    t.deepEqual(parse([{ name: "two", value: "two" }], [ "--two", "zwei" ]), {
        two: "zwei"
    });
    t.deepEqual(parse([{ name: "two", multiple: true, value: ["two", "zwei"] }], [ ]), {
        two: [ "two", "zwei" ]
    });
    t.deepEqual(parse([{ name: "two", multiple: true, value: ["two", "zwei"] }], [ "--two", "zwei" ]), {
        two: [ "zwei" ]
    });
    t.end();
});
