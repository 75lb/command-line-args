var test = require("tap").test;
var parse = require("../lib/command-line-args");


test("default option", function(t){
    var optionDefinitions = [
        { name: "files", defaultOption: true }
    ];
    var argv = [ "file1", "file2" ];
    t.deepEqual(parse(optionDefinitions, argv), {
        files: "file1"
    });
    t.end();
});

test("default option, Array", function(t){
    var optionDefinitions = [
        { name: "files", defaultOption: true, type: Array }
    ];
    var argv = [ "file1", "file2" ];
    t.deepEqual(parse(optionDefinitions, argv), {
        files: [ "file1", "file2" ]
    });
    t.end();
});
