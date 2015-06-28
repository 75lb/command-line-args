var test = require("tape");
var cliArgs = require("../");

var optionDefinitions = [
    { name: "one", type: Boolean }
];

test("type-boolean: different values", function(t){
    var cli = cliArgs(optionDefinitions);
    var usage = cli.getUsage({ title: "test" });
    t.ok(/test/.test(usage));
    t.end();
});
