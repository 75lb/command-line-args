var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "one", type: Number }
];

test("type-number: different values", function(t){
    t.deepEqual(
        parse(optionDefinitions, [ "--one", "1" ]),
        { one: 1 }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--one" ]),
        { one: null }
    );

    t.end();
});
