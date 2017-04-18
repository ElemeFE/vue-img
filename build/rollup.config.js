import eslint from 'rollup-plugin-eslint'
import buble from 'rollup-plugin-buble'

const argv = process.argv[4]
const config = {
  '--es5': { dest: 'vue-img', format: 'umd', plugins: [ eslint(), buble() ] },
  '--es6': { dest: 'vue-img.es6', format: 'es', plugins: [ eslint() ] }
}[argv]

export default {
  entry: 'src/index.js',
  dest: `dist/${config.dest}.js`,

  format: `${config.format}`,
  moduleName: 'VueImg',

  plugins: config.plugins
}
