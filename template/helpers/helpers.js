"use strict";
var a = require("array-tools");
var o = require("object-tools");
var s = require("string-tools");

exports.columns = columns;

function columns(array, options){
    return array.reduce(function(prev, curr){
        var context = {};
        o.each(options.hash, function(width, prop){
            if (curr[prop]) {
                context[prop] = s.padRight(curr[prop], width);
            }
        });
        return prev + options.fn(context);
    }, "");
}
