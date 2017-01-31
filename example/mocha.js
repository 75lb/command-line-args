'use strict'

/* demonstrates use in a mocha test script */

const assert = require('assert')
const commandLineArgs = require('../')

/*
enable partial parsing to prevent exceptions being thrown
if the user sets undefined, mocha-specific options (e.g. --no-colors)
*/
const options = commandLineArgs({ name: 'value', type: Number }, { partial: true })

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should pass when the supplied value is between 1 and 3', function () {
      assert.ok([ 1, 2, 3 ].indexOf(options.value) > -1)
    })
  })
})

/*
Example output:

$ mocha example/mocha.js --value 3 --no-colors


  Array
    #indexOf()
      ✓ should pass when the supplied value is between 1 and 3


  1 passing (7ms)

*/
