var cliArgs = require("../");

var optionDefinitions = [
    {
        groups: "Server",
        options: [
            {
                name: "port", alias: "p", type: Number, defaultOption: true,
                description: "the web server port"
            },
            {
                name: "log-format", alias: "f", type: String,
                description: "The access log format, written to stdout."
            },
            {
                name: "directory", alias: "d", type: String,
                description: "the root directory, defaults to the current directory"
            },
            {
                name: "compress", alias: "c", type: Boolean,
                description: "enables compression"
            },
            {
                name: "refreshRate", alias: "r", type: Number,
                description: "refresh rate of the statistics view in ms. Defaults to 500."
            }
        ]
    },
    {
        groups: "Misc",
        options: [
            {
                name: "help", alias: "h", type: Boolean,
                description: "print these usage instructions"
            },
            {
                name: "config", type: Boolean,
                description: "prints the stored config"
            }
        ]
    },

    { form: "one", description: "$ ws <server options>"}
];

var cli = cliArgs(optionDefinitions);
var argv = cli.parse();
var usage = cli.usage({
    // header: "Lightweight static web server, zero configuration. Perfect for front-end devs.",
    footer: "for more detailed instructions, visit https://github.com/75lb/local-web-server",
    columns: [
        { width: 18 },
        { width: 15 }
    ]
});

if (argv.Misc.help) console.log(usage); else console.dir(argv);
