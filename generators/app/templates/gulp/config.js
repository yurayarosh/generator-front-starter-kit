import colors from 'ansi-colors'
import log from 'fancy-log'
const argv = require('minimist')(process.argv.slice(2))<% if (multilanguage) { %>
import { existsSync, readdirSync } from 'fs'<% } %>

const production = argv.production || argv.prod || argv._.indexOf('build') !== -1 || false
const destPath = 'build'
const srcPath = 'src'
const staticPath = 'static'<% if (multilanguage) { %>
const languagesDataPath = `${srcPath}/languages`

const languageDirectories =
  existsSync(languagesDataPath) && readdirSync(languagesDataPath).length > 0
  ? readdirSync(languagesDataPath).filter(dir => dir.indexOf('.') !== 0) // Exclude system folders starting with.
  : ['']<% } %>

const config = {
  staticPath,
  env: 'development',
  production,<% if (multilanguage) { %>
  languageDirectories,
  defaultLanguage: 'ru',<% } %>

  src: {
    root: srcPath,
    templates: `${srcPath}/templates`,
    templatesData: `${srcPath}/templates/data`,
    pagelist: `${srcPath}/index.yaml`,
    styles: `${srcPath}/styles`,<% if (sprites.indexOf('sprite-svg') !== -1 || sprites.indexOf('png') !== -1) { %>
    // path for sass files that will be generated automatically via some of tasks
    stylesGen: `${srcPath}/styles/generated`,<% } %>
    js: `${srcPath}/js`,
    img: `${srcPath}/img`,
    svg: `${srcPath}/img/svg`,<% if (sprites.indexOf('sprite-svg') !== -1 || sprites.indexOf('png') !== -1 || sprites.indexOf('inline-svg') !== -1 || sprites.indexOf('inline-svg-lazy') !== -1) { %>
    icons: `${srcPath}/icons`,<% } %><% if (sprites.indexOf('inline-svg') !== -1) { %>
    iconsHTML: `${srcPath}/templates/icons`,<% } %>
    fonts: `${srcPath}/fonts`,<% if (multilanguage) { %>
    languages: languagesDataPath,<% } %>
  },
  dest: {
    root: destPath,
    html: destPath,
    css: `${destPath}/css`,
    js: `${destPath}/js`,
    img: `${destPath}/img`,<% if (sprites.indexOf('inline-svg-lazy') !== -1) { %>
    icons: `${destPath}/img/icons`,<% } %>
    fonts: `${destPath}/fonts`,<% if (pwa) { %>
    sw: `${destPath}/sw.js`,<% } %>
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
