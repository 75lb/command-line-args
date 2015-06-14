var test = require("tape");
var parse = require("../");

var optionDefinitions = [ { name: "one", type: "string" } ];

test("type-invalid: invalid type values", function(t){
    var argv = [ "--one", "something" ];
    t.throws(function(){
        parse([ { name: "one", type: "string" } ], argv)
    }, /invalid/i);
    
    t.throws(function(){
        parse([ { name: "one", type: 234 } ], argv)
    }, /invalid/i);

    t.throws(function(){
        parse([ { name: "one", type: {} } ], argv)
    }, /invalid/i);

    t.doesNotThrow(function(){
        parse([ { name: "one", type: function(){} } ], argv)
    }, /invalid/i);

    t.end();
});
