/* demonstrates use in a mocha test script */
const assert = require('assert')
const commandLineArgs = require('../')

/* enable partial parsing to prevent exceptions being thrown
if the user sets undefined, mocha-specific options (e.g. --no-colors) */
const options = commandLineArgs({ name: 'value', type: Number }, { partial: true })

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(options.value, [ 1, 2, 3 ].indexOf(4))
    })
  })
})

console.log(JSON.stringify(options, null, '  '))
