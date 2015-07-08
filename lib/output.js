"use strict";

/**
@module output
*/
module.exports = Output;

/**
@class
@alias module:output
*/
function Output(){}

Output.prototype.set = function(property, value){
    if (Array.isArray(this[property])){
        this[property].push(value);
    } else {
        this[property] = value;
    }
};
