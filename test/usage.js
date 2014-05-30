var test = require("tap").test;
var usage = require("../lib/command-line-args").usage;

test("usage", function(t){
    t.equal(typeof usage(optionDefinitions), "string");
    t.end();
});
