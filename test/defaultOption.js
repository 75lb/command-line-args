var test = require("tape");
var cliArgs = require("../");

test("defaultOption: string", function(t){
    var optionDefinitions = [
        { name: "files", defaultOption: true }
    ];
    var argv = [ "file1", "file2" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        files: "file2"
    });
    t.end();
});

test("defaultOption: multiple string", function(t){
    var optionDefinitions = [
        { name: "files", defaultOption: true, multiple: true }
    ];
    var argv = [ "file1", "file2" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        files: [ "file1", "file2" ]
    });
    t.end();
});
