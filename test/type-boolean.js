var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "one", type: Boolean }
];

test("type-boolean: different values", function(t){
    t.deepEqual(
        parse(optionDefinitions, [ "--one" ]),
        { one: true }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--one true" ]),
        { one: true }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--one false" ]),
        { one: true }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--one sfsgf" ]),
        { one: true }
    );

    t.end();
});
