module.exports = [
  {
    input: 'index.mjs',
    external: ['lodash.camelcase'],
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'commandLineArgs'
    }
  },
  {
    input: 'index.mjs',
    external: ['lodash.camelcase'],
    output: {
      file: 'dist/index.mjs',
      format: 'esm'
    }
  }
]
