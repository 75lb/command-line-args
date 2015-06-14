var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "array", type: Number, multiple: true },
];

var argv = [ "--array", "1", "2", "3" ];

test("multiple: true", function(t){
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        array: [ 1, 2, 3 ]
    });
    t.notDeepEqual(result, {
        array: [ "1", "2", "3" ]
    });
    t.end();
});
