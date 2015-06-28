var test = require("tape");
var cliArgs = require("../");

var optionDefinitions = [
    { name: "one", type: Boolean }
];

test("type-boolean: different values", function(t){
    t.deepEqual(
        cliArgs(optionDefinitions).parse([ "--one" ]),
        { one: true }
    );
    t.deepEqual(
        cliArgs(optionDefinitions).parse([ "--one true" ]),
        { one: true }
    );
    t.deepEqual(
        cliArgs(optionDefinitions).parse([ "--one false" ]),
        { one: true }
    );
    t.deepEqual(
        cliArgs(optionDefinitions).parse([ "--one sfsgf" ]),
        { one: true }
    );

    t.end();
});
