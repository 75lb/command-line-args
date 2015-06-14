var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "one", type: String }
];

test("type-string: different values", function(t){
    t.deepEqual(
        parse(optionDefinitions, [ "--one", "yeah" ]),
        { one: "yeah" }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--one" ]),
        { one: null }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--one", "--two" ]),
        { one: null }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--one", "3" ]),
        { one: "3" }
    );

    t.end();
});
