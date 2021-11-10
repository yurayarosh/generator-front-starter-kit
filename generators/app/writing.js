const { join } = require('path')
const mkdirp = require('mkdirp')

module.exports = function () {
  const { props, fs } = this
  const destPath = this.destinationPath()

  const HAS_PREVIEW = props.preview
  const HAS_PNG = props.sprites.indexOf('png') !== -1
  const HAS_SVG = props.sprites.indexOf('sprite-svg') !== -1
  const HAS_SVG_INLINE = props.sprites.indexOf('inline-svg') !== -1
  const HAS_SVG_INLINE_LAZY = props.sprites.indexOf('inline-svg-lazy') !== -1
  const HAS_SASS = props.css === 'sass'
  const HAS_SCSS = props.css === 'scss'
  const HAS_MULTILANGUAGE = props.multilanguage
  const IS_PWA = props.pwa
  // const HAS_SAY_HELLO = props.sayHello // maybe later i' ll add sayHello() generating

  // dotfiles
  fs.copy(this.templatePath('gitignore'), '.gitignore')
  fs.copy(this.templatePath('.editorconfig'), '.editorconfig')
  fs.copy(this.templatePath('.htmlhintrc'), '.htmlhintrc')
  fs.copy(this.templatePath('.sass-lint.yml'), '.sass-lint.yml')
  fs.copy(this.templatePath('.stylelintrc'), '.stylelintrc')
  fs.copyTpl(this.templatePath('gulpfile.babel.js'), 'gulpfile.babel.js', props)
  fs.copy(this.templatePath('README.md'), 'README.md')
  fs.copyTpl(this.templatePath('package.json'), 'package.json', props)

  // gulp configs and utils
  fs.copyTpl(this.templatePath('gulp/config.js'), 'gulp/config.js', props)
  fs.copy(this.templatePath('gulp/util'), 'gulp/util')

  // common tasks
  fs.copy(this.templatePath('gulp/tasks/copy.js'), 'gulp/tasks/copy.js')
  fs.copy(this.templatePath('gulp/tasks/clean.js'), 'gulp/tasks/clean.js')
  fs.copy(this.templatePath('gulp/tasks/server.js'), 'gulp/tasks/server.js')
  fs.copy(this.templatePath('gulp/tasks/webpack.js'), 'gulp/tasks/webpack.js')
  fs.copy(this.templatePath('gulp/tasks/sass.js'), 'gulp/tasks/sass.js')
  fs.copy(this.templatePath('gulp/tasks/svgo.js'), 'gulp/tasks/svgo.js')

  // common files and directories
  fs.copy(this.templatePath('webpack.config.js'), 'webpack.config.js')
  fs.copy(this.templatePath('src/img/svgo/facebook.svg'), 'src/img/svgo/facebook.svg')
  fs.copy(this.templatePath('static/favicon.ico'), 'static/favicon.ico')
  fs.copy(this.templatePath('static/favicon-16x16.png'), 'static/favicon-16x16.png')
  fs.copy(this.templatePath('static/favicon-32x32.png'), 'static/favicon-32x32.png')
  fs.copy(this.templatePath('static/mstile-150x150.png'), 'static/mstile-150x150.png')
  fs.copy(this.templatePath('static/browserconfig.xml'), 'static/browserconfig.xml.png')
  fs.copy(this.templatePath('static/apple-touch-icon.png'), 'static/apple-touch-icon.png')
  fs.copy(this.templatePath('static/safari-pinned-tab.svg'), 'static/safari-pinned-tab.svg')
  fs.copy(this.templatePath('static/fonts'), 'static/fonts')
  fs.copy(this.templatePath('src/js'), 'src/js')
  fs.copyTpl(this.templatePath('src/js/components/LazyLoader/LazyLoader.js'), 'src/js/components/LazyLoader/LazyLoader.js', props)
  fs.copy(this.templatePath('src/templates'), 'src/templates')
  fs.copyTpl(
    this.templatePath('src/templates/layouts/_default.html'),
    'src/templates/layouts/_default.html',
    props
  )
  fs.copyTpl(
    this.templatePath('src/templates/mixins/_icon.html'),
    'src/templates/mixins/_icon.html',
    props
  )
  fs.copyTpl(
    this.templatePath('src/templates/mixins/_all.html'),
    'src/templates/mixins/_all.html',
    props
  )

  //condition files
  if (HAS_SVG_INLINE_LAZY || HAS_SVG_INLINE || HAS_SVG) {
    fs.copy(this.templatePath('src/icons/facebook.svg'), 'src/icons/facebook.svg')
  }
  if (HAS_PNG) {
    fs.copy(this.templatePath('src/icons/facebook.png'), 'src/icons/facebook.png')
    fs.copy(this.templatePath('src/icons/facebook@2x.png'), 'src/icons/facebook@2x.png')
  }
  if (HAS_MULTILANGUAGE) fs.copy(this.templatePath('src/languages'), 'src/languages')

  // condition tasks
  if (HAS_MULTILANGUAGE) {
    fs.copy(this.templatePath('gulp/tasks/nunjucks-multilanguage.js'), 'gulp/tasks/nunjucks.js')
    fs.copy(
      this.templatePath('gulp/tasks/index-multilanguage/index.html'),
      'gulp/tasks/index/index.html'
    )
    fs.copy(this.templatePath('gulp/tasks/list-pages-multilanguage.js'), 'gulp/tasks/list-pages.js')
    fs.copyTpl(this.templatePath('src/index.yaml'), 'src/index.yaml', props)
  } else if (HAS_PREVIEW) {
    fs.copy(this.templatePath('gulp/tasks/nunjucks.js'), 'gulp/tasks/nunjucks.js')
    fs.copy(this.templatePath('gulp/tasks/index/index.html'), 'gulp/tasks/index/index.html')
    fs.copy(this.templatePath('gulp/tasks/list-pages.js'), 'gulp/tasks/list-pages.js')
    fs.copyTpl(this.templatePath('src/index.yaml'), 'src/index.yaml', props)
  } else {
    fs.copy(this.templatePath('gulp/tasks/nunjucks.js'), 'gulp/tasks/nunjucks.js')
  }

  // svg inline task
  if (HAS_SVG_INLINE_LAZY || HAS_SVG_INLINE) {
    fs.copyTpl(this.templatePath('gulp/tasks/svgicons.js'), 'gulp/tasks/svgicons.js', props)
  }

  // svg sprites task
  if (HAS_SVG) {
    fs.copy(this.templatePath('gulp/tasks/sprite-svg.js'), 'gulp/tasks/sprite-svg.js')

    fs.copy(
      this.templatePath('gulp/tasks/sprite-svg/_sprite-svg.scss'),
      'gulp/tasks/sprite-svg/_sprite-svg.scss'
    )
  }

  // png sprites task
  if (HAS_PNG) {
    fs.copy(this.templatePath('gulp/tasks/sprite-png.js'), 'gulp/tasks/sprite-png.js')

    fs.copyTpl(
      this.templatePath('gulp/tasks/sprite-png/sprite.template.mustache'),
      'gulp/tasks/sprite-png/sprite.template.mustache',
      props
    )
  }

  if (HAS_SASS) {
    fs.copy(this.templatePath('src/sass'), 'src/styles')
    fs.copyTpl(this.templatePath('src/sass/app.sass'), 'src/styles/app.sass', props)
  }

  if (HAS_SCSS) {
    fs.copy(this.templatePath('src/scss'), 'src/styles')
    fs.copyTpl(this.templatePath('src/scss/app.scss'), 'src/styles/app.scss', props)
  }

  if (IS_PWA) {
    fs.copy(
      this.templatePath('static/android-chrome-192x192.png'),
      'static/android-chrome-192x192.png'
    )
    fs.copy(
      this.templatePath('static/android-chrome-512x512.png'),
      'static/android-chrome-512x512.png'
    )
    fs.copyTpl(this.templatePath('static/site.webmanifest'), 'static/site.webmanifest', props)
    fs.copy(this.templatePath('gulp/tasks/sw.js'), 'gulp/tasks/sw.js')
  }

  // delete files and directories
  // css
  if (!HAS_PNG && HAS_SASS) fs.delete('src/styles/_icons-png.sass')
  if (!HAS_PNG && HAS_SCSS) fs.delete('src/styles/_icons-png.scss')

  // js
  // if (!HAS_SAY_HELLO) fs.delete('src/js/lib/sayHello.js')

  // html
  if (!HAS_PREVIEW && !HAS_MULTILANGUAGE) {
    fs.delete('src/templates/page.html')
    fs.copy(this.templatePath('src/templates/page.html'), 'src/templates/index.html')
  }
  if (!HAS_SVG_INLINE_LAZY && !HAS_SVG_INLINE && !HAS_PNG) fs.delete('src/templates/mixins/_icon.html')
}
