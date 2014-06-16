var cliArgs = require("../");

var optionDefinitions = [
    { 
        name: "port", alias: "p", type: Number, defaultOption: true,
        description: "the web server port"
    },
    { 
        name: "log-format", alias: "f", type: String,
        description: "The access log format, written to stdout."
    },
    { 
        name: "help", alias: "h", type: Boolean,
        description: "print these usage instructions"
    },
    { 
        name: "directory", alias: "d", type: String,
        description: "the root directory, defaults to the current directory"
    },
    { 
        name: "config", type: Boolean,
        description: "the web server port"
    },
    { 
        name: "compress", alias: "c", type: Boolean,
        description: "the web server port"
    },
    { 
        name: "refreshRate", alias: "r", type: Number,
        description: "the web server port"
    }
];

var cli = cliArgs(optionDefinitions);
var argv = cli.parse();
var usage = cli.usage({ 
    header: "Lightweight static web server, zero configuration. Perfect for front-end devs.",
    footer: "for more detailed instructions, visit https://github.com/75lb/local-web-server",
    columns: [
        { width: 18 },
        { width: 15 }
    ]
});

if (argv.help) console.log(usage); else console.dir(argv);
