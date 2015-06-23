modules.exports = [
    {
        name: "verbose", alias: "v", type: Boolean,
        description: "If passed this option will cause bucket-loads of text to appear on your screen"
    },
    {
        name: "help", alias: "h", type: Boolean,
        description: "Set this option to display the usage information"
    },
    {
        name: "colour", alias: "c", value: "red",
        description: "you can specify a colour which will be displayed appropriately"
    },
    { name: "number", alias: "n", type: Number },
    {
        name: "files", type: Array, defaultOption: true,
        description: "The default option, a list of files to do nothing about or with"
    }
];
