import a from 'assert'
import Definitions from '../../lib/option-definitions.mjs'


test('.get(long option)', function () {
  const definitions = Definitions.from([{ name: 'one' }])
  a.strictEqual(definitions.get('--one').name, 'one')
})

test('.get(short option)', function () {
  const definitions = Definitions.from([{ name: 'one', alias: 'o' }])
  a.strictEqual(definitions.get('-o').name, 'one')
})

test('.get(name)', function () {
  const definitions = Definitions.from([{ name: 'one' }])
  a.strictEqual(definitions.get('one').name, 'one')
})

test('.validate()', function () {
  a.throws(function () {
    const definitions = new Definitions()
    definitions.load([{ name: 'one' }, { name: 'one' }])
  })
})
