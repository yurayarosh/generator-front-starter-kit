import gulp from 'gulp'
import nunjucksRender from 'gulp-nunjucks-render'
import plumber from 'gulp-plumber'
import gulpif from 'gulp-if'
import changed from 'gulp-changed'
import prettify from 'gulp-prettify'
import frontMatter from 'gulp-front-matter'
import data from 'gulp-data'
import rename from 'gulp-rename'
import { basename, extname } from 'path'
import { readFileSync, existsSync } from 'fs'
import { src, dest, production, errorHandler, languageDirectories } from '../config'

const renderHtml = onlyChanged => {
  nunjucksRender.nunjucks.configure({
    watch: false,
    trimBlocks: true,
    lstripBlocks: false,
  })

  languageDirectories.forEach(dir => {
    return gulp
      .src([`${src.templates}/**/[^_]*.html`])
      .pipe(
        plumber({
          errorHandler,
        })
      )
      .pipe(gulpif(onlyChanged, changed(dest.html)))
      .pipe(frontMatter({ property: 'data' }))
      .pipe(
        data(file => {
          if (!dir) return null

          const { relative } = file

          const globalDataBuffer = existsSync(`${src.languages}/${dir}/global.json`)
            ? readFileSync(`${src.languages}/${dir}/global.json`)
            : null
          const globalData =
            globalDataBuffer && globalDataBuffer.length > 0 ? JSON.parse(globalDataBuffer) : {}

          const jsonName = basename(relative, extname(relative))

          const currentDataBuffer = existsSync(`${src.languages}/${dir}/${jsonName}.json`)
            ? readFileSync(`${src.languages}/${dir}/${jsonName}.json`)
            : null
          const currentData =
            currentDataBuffer && currentDataBuffer.length > 0 ? JSON.parse(currentDataBuffer) : {}

          return { ...globalData, ...currentData }
        })
      )
      .pipe(
        nunjucksRender({
          PRODUCTION: production,
          path: [src.templates],
        })
      )
      .pipe(
        prettify({
          indent_size: 2,
          wrap_attributes: 'auto', // 'force'
          preserve_newlines: false,
          // unformatted: [],
          end_with_newline: true,
        })
      )
      .pipe(
        rename({
          suffix: !!dir ? `-${dir}` : '',
        })
      )
      .pipe(gulp.dest(dest.html))
  })
}

gulp.task('nunjucks', done => {
  renderHtml()
  done()
})
gulp.task('nunjucks:changed', done => {
  renderHtml(true)
  done()
})

const build = gulp => gulp.parallel('nunjucks')
const watch = gulp => () => {
  gulp.watch([`${src.templates}/**/[^_]*.html`], gulp.parallel('nunjucks:changed'))

  gulp.watch([`${src.templates}/**/_*.html`], gulp.parallel('nunjucks'))
}

module.exports.build = build
module.exports.watch = watch
