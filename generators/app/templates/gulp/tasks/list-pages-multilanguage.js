import gulp from 'gulp'
import consolidate from 'gulp-consolidate'
import req from 'require-yml'
import { src, dest, languageDirectories, defaultLanguage } from '../config'

const renderPages = () => {
  const pageBlocks = req(src.pagelist)

  const allPages = languageDirectories.map(dir => ({
    ...pageBlocks,
    lang: dir,
  }))

  return gulp
    .src(`${__dirname}/index/index.html`)
    .pipe(
      consolidate('lodash', {
        DEFAULT_LANGUAGE: defaultLanguage,
        pageBlocks: allPages,
      })
    )
    .pipe(gulp.dest(dest.html))
}

gulp.task('list-pages', done => {
  renderPages()
  done()
})

const build = gulp => gulp.parallel('list-pages')
const watch = gulp => () => gulp.watch(`${src.root}/*`, gulp.series('list-pages'))

module.exports.build = build
module.exports.watch = watch
