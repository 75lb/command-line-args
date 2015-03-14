var test = require("tape");
var cliArgs = require("../lib/command-line-args");

test("parse works with default argv", function(t){
    var argv = [ "--verbose", "-d", "--colour", "red", "--number", 3 ];
    
    var result = cliArgs([]).parse();
    t.end();
});
