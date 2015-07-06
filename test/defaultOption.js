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

test("defaultOption: multiple defaultOption values between other arg/value pairs", function(t){
    var optionDefinitions = [
        { name: "one" },
        { name: "two" },
        { name: "files", defaultOption: true, multiple: true }
    ];
    var argv = [ "one", "1", "file1", "file2", "two", "2" ];
    t.deepEqual(cliArgs(optionDefinitions).parse(argv), {
        one: "1",
        two: "2",
        files: [ "file1", "file2" ]
    });
    t.end();
});
