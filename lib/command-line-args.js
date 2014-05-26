module.exports = parse;
function parse(expectArgs, argv) {
  var shortArg = /-\w/,
      longArg = /--\w+/,
      output = {},
      arg;
  argv = argv === process.argv ? argv.slice(2) : argv.slice(0);
  while (typeof(arg = argv.shift()) !== "undefined") {
    try {
      throw undefined;
    } catch (a) {
      a = "ho";
      console.log(arg, a);
      if (longArg.test(arg)) {}
    }
  }
}
