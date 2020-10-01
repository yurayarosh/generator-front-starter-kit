import gulp from 'gulp'
import nunjucksRender from 'gulp-nunjucks-render'
import plumber from 'gulp-plumber'
import gulpif from 'gulp-if'
import changed from 'gulp-changed'
import prettify from 'gulp-prettify'
import frontMatter from 'gulp-front-matter'
import data from 'gulp-data'
import jsonlint from 'gulp-jsonlint'

import { basename, extname } from 'path'
import { readFileSync, existsSync } from 'fs'
import {
  src,
  dest,
  production,
  errorHandler,
  languageDirectories,
  defaultLanguage,
} from '../config'

const renderHtml = onlyChanged => {
  nunjucksRender.nunjucks.configure({
    watch: false,
    trimBlocks: true,
    lstripBlocks: false,
  })

  languageDirectories.forEach(dir => {
    const subfolder = dir === 'uk' ? 'ua' : dir
    const destPath = dir === defaultLanguage ? dest.html : `${dest.html}/${subfolder}`

    const EXTENSION = 'json'
    const GLOBAL_DATA_FILE_NAME = 'global'

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

          const globalData = (() => {
            const pathToDataFile = `${src.languages}/${dir}/${GLOBAL_DATA_FILE_NAME}.${EXTENSION}`
            const buffer = existsSync(pathToDataFile) ? readFileSync(pathToDataFile) : null
            const data = buffer && buffer.length > 0 ? JSON.parse(buffer) : {}
            return data
          })()

          const currentPageData = (() => {
            const relativeToArray = relative.split('/')
            const subfolderPath = relativeToArray.slice(0, relativeToArray.length - 1).join('/')
            const dataFileName = basename(relative, extname(relative))

            const pathToDataFile = subfolderPath
              ? `${src.languages}/${dir}/${subfolderPath}/${dataFileName}.${EXTENSION}`
              : `${src.languages}/${dir}/${dataFileName}.${EXTENSION}`

            const buffer = existsSync(pathToDataFile) ? readFileSync(pathToDataFile) : null
            const data = buffer && buffer.length > 0 ? JSON.parse(buffer) : {}

            return data
          })()

          return { ...globalData, ...currentPageData }
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
          end_with_newline: true,
        })
      )
      .pipe(gulp.dest(destPath))
  })
}

gulp.task('jsonlint', () => {
  return gulp
    .src(`${src.languages}/**/*.json`)
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())
})

gulp.task('nunjucks', done => {
  renderHtml()
  done()
})
gulp.task('nunjucks:changed', done => {
  renderHtml(true)
  done()
})

const build = gulp => gulp.parallel('jsonlint', 'nunjucks')
const watch = gulp => () => {
  gulp.watch([`${src.templates}/**/[^_]*.html`], gulp.parallel('jsonlint', 'nunjucks:changed'))

  gulp.watch([`${src.templates}/**/_*.html`], gulp.parallel('jsonlint', 'nunjucks'))
}

module.exports.build = build
module.exports.watch = watch
