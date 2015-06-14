var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "file", multiple: true, type: function(file){
        return file;
    }}
];

test("type-other-multiple: different values", function(t){
    t.deepEqual(
        parse(optionDefinitions, [ "--file", "one.js" ]),
        { file: [ "one.js" ] }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--file", "one.js", "two.js" ]),
        { file: [ "one.js", "two.js" ] }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--file" ]),
        { file: [] }
    );
    t.deepEqual(
        parse(optionDefinitions, [ "--file", "--two" ]),
        { file: [] }
    );

    t.end();
});
