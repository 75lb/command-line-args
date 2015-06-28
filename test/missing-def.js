var test = require("tape");
var cliArgs = require("../");

var optionDefinitions = [
    { name: "one", type: Number }
];

test("missing def: set a value without option definition", function(t){
    t.deepEqual(
        cliArgs(optionDefinitions).parse([ "--one", "1" ]),
        { one: 1 }
    );

    t.throws(function(){
        cliArgs(optionDefinitions).parse([ "--one", "--two" ]);
    }, /invalid/i);

    t.throws(function(){
        cliArgs(optionDefinitions).parse([ "--one", "2", "--two", "two" ]);
    }, /invalid/i);

    t.throws(function(){
        cliArgs(optionDefinitions).parse([ "-a", "2" ]);
    }, /invalid/i);

    t.end();
});
