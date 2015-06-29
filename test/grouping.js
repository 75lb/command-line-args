var test = require("tape");
var cliArgs = require("../");

var optionDefinitions = [
    { name: "one", group: "a" },
    { name: "two", group: "a" },
    { name: "three", group: "b" },
];

test("groups", function(t){
    var cli = cliArgs(optionDefinitions);
    t.deepEqual(cli.parse([ "--one", "1", "--two", "2", "--three", "3" ]), { 
        a: {
            one: "1",
            two: "2"
        },
        b: {
            three: "3"
        },
        _none: {},
        _all: {
            one: "1",
            two: "2",
            three: "3"
        }
    });

    t.end();
});
