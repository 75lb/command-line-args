var test = require("tape");
var cliArgs = require("../");

var optionDefinitions = [
    { name: "array", type: Number, multiple: true },
];

var argv = [ "--array", "1", "2", "3" ];

test("multiple: true", function(t){
    var result = cliArgs(optionDefinitions).parse(argv);
    t.deepEqual(result, {
        array: [ 1, 2, 3 ]
    });
    t.notDeepEqual(result, {
        array: [ "1", "2", "3" ]
    });
    t.end();
});
