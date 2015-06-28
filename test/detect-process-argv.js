var test = require("tape");
var cliArgs = require("../");

test("detect process.argv: should automatically remove first two argv items", function(t){
    process.argv = [ "node", "filename", "--one", "eins" ];
    t.deepEqual(cliArgs({ name: "one" }).parse(process.argv), {
        one: "eins"
    });
    t.end();
});
