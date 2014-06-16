"use strict";
var a = require("array-tools"),
    o = require("object-tools"),
    s = require("string-tools");

module.exports = function(handlebars){
    handlebars.registerHelper("columns", function(array, options){
        return array.reduce(function(prev, curr){
            var context = {};
            o.each(options.hash, function(width, prop){
                if (curr[prop]) {
                    context[prop] = s.padRight(curr[prop], width);
                }
            });
            return prev + options.fn(context);
        }, "");
    });
};
