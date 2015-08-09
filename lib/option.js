"use strict";

/**
@module option
@private
*/

function Arg(re){
    this.re = re;
}
Arg.prototype.name = function(arg){
    return arg.match(this.re)[1];
};
Arg.prototype.test = function(arg){
    return this.re.test(arg);
};

var option = {
    short: new Arg(/^-(\w)$/),
    long: new Arg(/^--([\w-]+)/),
    combined: new Arg(/^-(\w{2,})$/),
    isOption: function(arg){
        return this.short.test(arg) || this.long.test(arg);
    },
    optEquals: new Arg(/^(--[\w-]+)=(.*)/)
};

module.exports = option;
