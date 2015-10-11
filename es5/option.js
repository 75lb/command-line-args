'use strict';

/**
@module option
@private
*/

function Arg(re) {
  this.re = re;
}
Arg.prototype.name = function (arg) {
  return arg.match(this.re)[1];
};
Arg.prototype.test = function (arg) {
  return this.re.test(arg);
};

var option = {
  short: new Arg(/^-([^\d-])$/),
  long: new Arg(/^--(\S+)/),
  combined: new Arg(/^-([^\d-]{2,})$/),
  isOption: function isOption(arg) {
    return this.short.test(arg) || this.long.test(arg);
  },
  optEquals: new Arg(/^(--\S+)=(.*)/)
};

module.exports = option;