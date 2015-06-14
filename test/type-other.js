var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "file", type: function(file){
        return file;
    }}
];

test("type-other: different values", function(t){
    t.deepEqual(
        parse(optionDefinitions, [ "--file", "one.js" ]),
        { file: "one.js" }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--file" ]),
        { file: null }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--file", "--two" ]),
        { file: null }
    );

    t.end();
});
