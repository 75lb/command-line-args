var test = require("tape");
var cliArgs = require("../");

var optionDefinitions = [
    { name: "one", alias: "1" },
    { name: "two", alias: "2" },
    { name: "three", alias: "3" },
    { name: "four", alias: "4" }
];

test("name-alias-mix: one of each", function(t){
    var argv = [ "--one", "-2", "--three" ];
    var cli = cliArgs(optionDefinitions);
    var result = cli.parse(argv);
    t.strictEqual(result.one, true);
    t.strictEqual(result.two, true);
    t.strictEqual(result.three, true);
    t.strictEqual(result.four, undefined);
    t.end();
});
