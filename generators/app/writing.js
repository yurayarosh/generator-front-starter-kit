const { join } = require('path')
const mkdirp = require('mkdirp')

module.exports = function() {
  const { props, fs } = this
  const destPath = this.destinationPath()

  const HAS_PREVIEW = props.preview
  const HAS_PNG = props.sprites.indexOf('png') !== -1
  const HAS_SVG = props.sprites.indexOf('sprite-svg') !== -1
  const HAS_SVG_INLINE = props.sprites.indexOf('inline-svg') !== -1  
  const HAS_SASS = true // maybe later I 'll add scss generation
  // const HAS_SASS = props.css === 'sass'
  // const HAS_SCSS = props.css === 'scss'
  const HAS_CSS_GRID = props.cssGrid
  const HAS_MULTILANGUAGE = props.multilanguage
  const HAS_DEMIWEB_HELLO = props.sayHello

  // create directories
  mkdirp(join(destPath, 'src/fonts'))

  // dotfiles
  fs.copy(this.templatePath('.gitignore'), '.gitignore')
  fs.copy(this.templatePath('.editorconfig'), '.editorconfig')
  fs.copy(this.templatePath('.htmlhintrc'), '.htmlhintrc')
  fs.copy(this.templatePath('.sass-lint.yml'), '.sass-lint.yml')
  fs.copy(this.templatePath('.stylelintrc'), '.stylelintrc')
  fs.copyTpl(this.templatePath('gulpfile.babel.js'), 'gulpfile.babel.js', props)
  fs.copy(this.templatePath('README.md'), 'README.md')
  fs.copyTpl(this.templatePath('package.json'), 'package.json', props)

  // gulp configs
  fs.copy(this.templatePath('gulp/config.js'), 'gulp/config.js')
  fs.copy(this.templatePath('gulp/util/handle-errors.js'), 'gulp/util/handle-errors.js')

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
  fs.copy(this.templatePath('src/js'), 'src/js')
  fs.copyTpl(this.templatePath('src/js/app.js'), 'src/js/app.js', props)
  fs.copy(this.templatePath('src/templates'), 'src/templates')
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
  if (HAS_SVG_INLINE || HAS_SVG) {
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
  if (HAS_SVG_INLINE) {
    fs.copy(this.templatePath('gulp/tasks/svgicons.js'), 'gulp/tasks/svgicons.js')
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

  // if (HAS_SASS) {
  fs.copy(this.templatePath('src/sass'), 'src/sass')
  fs.copyTpl(this.templatePath('src/sass/app.sass'), 'src/sass/app.sass', props)
  // }

  // if (HAS_SCSS) {
  //   fs.copy(this.templatePath('src/scss'), 'src/scss')
  //   fs.copyTpl(this.templatePath('src/scss/app.scss'), 'src/scss/app.scss', props)
  // }

  // delete files and directories
  // css
  if (!HAS_CSS_GRID && HAS_SASS) fs.delete('src/sass/lib/grid')
  if (!HAS_PNG) fs.delete('src/sass/_icons-png.sass')
  // if (!HAS_CSS_GRID && HAS_SCSS) fs.delete('src/scss/lib/grid')

  // js
  if (!HAS_DEMIWEB_HELLO) fs.delete('src/js/lib/sayHello.js')

  // html
  if (!HAS_PREVIEW && !HAS_MULTILANGUAGE) {
    fs.delete('src/templates/page.html')
    fs.copy(this.templatePath('src/templates/page.html'), 'src/templates/index.html')
  }
}
