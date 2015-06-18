var test = require("tape");
var parse = require("../");

test("detect process.argv: should automatically remove first two argv items", function(t){
    process.argv = [ "node", "filename", "--one", "eins" ];
    t.deepEqual(parse({ name: "one" }, process.argv), {
        one: "eins"
    });
    t.end();
});
