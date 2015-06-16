var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "one", type: Number }
];

test("missing def: set a value without option definition", function(t){
    t.deepEqual(
        parse(optionDefinitions, [ "--one", "1" ]),
        { one: 1 }
    );

    t.throws(function(){
        parse(optionDefinitions, [ "--one", "--two" ]);
    }, /invalid/i);

    t.throws(function(){
        parse(optionDefinitions, [ "--one", "2", "--two", "two" ]);
    }, /invalid/i);

    t.throws(function(){
        parse(optionDefinitions, [ "-a", "2" ]);
    }, /invalid/i);

    t.end();
});
