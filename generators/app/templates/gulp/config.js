import colors from 'ansi-colors'
import log from 'fancy-log'
const argv = require('minimist')(process.argv.slice(2))<% if (multilanguage) { %>
import { existsSync, readdirSync } from 'fs'<% } %>

const production =
argv.production || argv.prod || argv._.indexOf('build') !== -1 || false
const destPath = 'build'
const srcPath = 'src'
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
    root: srcPath,
    templates: `${srcPath}/templates`,
    templatesData: `${srcPath}/templates/data`,
    pagelist: `${srcPath}/index.yaml`,
    styles: `${srcPath}/styles`,
    // path for sass files that will be generated automatically via some of tasks
    stylesGen: `${srcPath}/styles/generated`,
    js: `${srcPath}/js`,
    img: `${srcPath}/img`,
    video: `${srcPath}/video`,
    svg: `${srcPath}/img/svg`,
    icons: `${srcPath}/icons`,
    iconsHTML: `${srcPath}/templates/icons`,
    fonts: `${srcPath}/fonts`,
    data: `${srcPath}/data`,
    languages: `${srcPath}/languages`,
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
