var test = require("tape");
var cliArgs = require("../lib/command-line-args");


test("default option", function(t){
    var optionDefinitions = [
        { name: "files", defaultOption: true }
    ];
    var argv = [ "file1", "file2" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        files: "file1"
    });
    t.end();
});

test("default option, Array", function(t){
    var optionDefinitions = [
        { name: "files", defaultOption: true, type: Array }
    ];
    var argv = [ "file1", "file2" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        files: [ "file1", "file2" ]
    });
    t.end();
});
