"use strict";

/**
@module definition
*/
module.exports = Definition;

/**
@class
@classdesc Option Definition
@alias module:definition
*/
function Definition(definition){
    /**
    @type {string}
    */
    this.name = definition.name;

    /**
    @type {function}
    */
    this.type = definition.type;

    /**
    @type {string} - a single character
    */
    this.alias = definition.alias;

    /**
    @type {boolean}
    */
    this.multiple = definition.multiple;

    /**
    @type {boolean}
    */
    this.value = definition.value;

    /**
    @type {string|string[]}
    */
    this.group = definition.group;
}
