import gulp from 'gulp'
import consolidate from 'gulp-consolidate'
import req from 'require-yml'
import { src, dest } from '../config'

gulp.task('list-pages', () => {
  const pages = req(src.pagelist)

  return gulp
    .src(`${__dirname}/index/index.html`)
    .pipe(consolidate('lodash', {
      pages,
    }))
    .pipe(gulp.dest(dest.html))
})

const build = gulp => gulp.parallel('list-pages')
const watch = gulp => () => gulp.watch(`${src.root}/*`, gulp.series('list-pages'))

module.exports.build = build
module.exports.watch = watch
