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
    @type {string}
    */
    this.description = definition.description;

    /**
    a single character
    @type {string}
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
    @type {boolean}
    */
    this.defaultOption = definition.defaultOption;

    /**
    @type {string|string[]}
    */
    this.group = definition.group;
}

Definition.prototype.getInitialValue = function(){
    if (this.multiple){
        return [];
    } else if (this.type === Boolean || !this.type){
        return true;
    } else {
        return null;
    }
};
Definition.prototype.isBoolean = function(){
    return this.type === Boolean;
};
