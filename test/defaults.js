var test = require("tape");
var parse = require("../");

test("parse works with default argv", function(t){
    var argv = [ "--verbose", "-d", "--colour", "red", "--number", 3 ];
    
    var result = cliArgs([]).parse();
    t.end();
});
