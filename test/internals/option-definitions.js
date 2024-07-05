import TestRunner from 'test-runner'
import a from 'assert'
import Definitions from '../../lib/option-definitions.js'

const tom = new TestRunner.Tom()

tom.test('.get(long option)', function () {
  const definitions = Definitions.from([{ name: 'one' }])
  a.strictEqual(definitions.get('--one').name, 'one')
})

tom.test('.get(short option)', function () {
  const definitions = Definitions.from([{ name: 'one', alias: 'o' }])
  a.strictEqual(definitions.get('-o').name, 'one')
})

tom.test('.get(name)', function () {
  const definitions = Definitions.from([{ name: 'one' }])
  a.strictEqual(definitions.get('one').name, 'one')
})

tom.test('.validate()', function () {
  a.throws(function () {
    const definitions = new Definitions()
    definitions.load([{ name: 'one' }, { name: 'one' }])
  })
})

export default tom
