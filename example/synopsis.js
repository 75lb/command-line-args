var cliArgs = require("../");

var cli = cliArgs([
    { name: "verbose", type: Boolean, alias: "v", description: "Write plenty output" },
    { name: "help", type: Boolean, description: "Print usage instructions" },
    { name: "files", type: Array, defaultOption: true, description: "The input files" }
]);

var options = cli.parse(),
    usage = cli.getUsage({
        header: "A synopsis application.",
        footer: "For more information, visit http://example.com"
    });
    
console.log(options.help ? usage : options);
