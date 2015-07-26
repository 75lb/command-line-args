module.exports = [
    { name: "help", alias: "h", type: Boolean, description: "Display this usage guide." },
    { name: "files", alias: "f", type: String, multiple: true, defaultOption: true, description: "The input files to process" },
    { name: "timeout", alias: "t", type: Number, description: "Timeout value in ms" },
    { name: "log-level", alias: "l", type: String, description: "info, warn or error" }
];
