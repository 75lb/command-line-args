var test = require("tape");
var parse = require("../");

var optionDefinitions = [
    { name: "verbose", alias: "v", type: Boolean },
    { name: "array", alias: "a", type: Number, multiple: true },
];

var argv = [ "-v", "--array", "1", "2", "3" ];

test(".parse(optionDefinitions, argv)", function(t){
    var result = parse(optionDefinitions, argv);
    t.deepEqual(result, {
        verbose: true,
        array: [ 1, 2, 3 ]
    });
    t.end();
});
