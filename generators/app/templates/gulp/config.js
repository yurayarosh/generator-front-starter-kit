import colors from 'ansi-colors'
import log from 'fancy-log'
const argv = require('minimist')(process.argv.slice(2))<% if (multilanguage) { %>
import { existsSync, readdirSync } from 'fs'<% } %>

const production =
argv.production || argv.prod || argv._.indexOf('build') !== -1 || false
const destPath = 'build'
<% if (multilanguage) { %>
const languageDirectories =
  existsSync('src/languages') && readdirSync('src/languages').length > 0
  ? readdirSync('src/languages')
  : ['']<% } %>

const config = {
  env: 'development',
  production,<% if (multilanguage) { %>
  languageDirectories,<% } %>

  src: {
    root: 'src',
    templates: 'src/templates',
    templatesData: 'src/templates/data',
    pagelist: 'src/index.yaml',
    sass: 'src/sass',
    // path for sass files that will be generated automatically via some of tasks
    sassGen: 'src/sass/generated',
    js: 'src/js',
    img: 'src/img',
    video: 'src/video',
    svg: 'src/img/svg',
    icons: 'src/icons',
    iconsHTML: 'src/templates/icons',
    fonts: 'src/fonts',
    data: 'src/data',
    languages: 'src/languages',
  },
  dest: {
    root: destPath,
    html: destPath,
    css: `${destPath}/css`,
    js: `${destPath}/js`,
    img: `${destPath}/img`,
    video: `${destPath}/video`,
    fonts: `${destPath}/fonts`,
    data: `${destPath}/data`,
  },

  setEnv(env) {
    if (typeof env !== 'string') return
    this.env = env
    this.production = env === 'production'
    process.env.NODE_ENV = env
  },

  logEnv() {
    log('Environment:', colors.white.bgRed(` ${process.env.NODE_ENV} `))
  },

  errorHandler: require('./util/handle-errors'),
}

config.setEnv(production ? 'production' : 'development')

module.exports = config
