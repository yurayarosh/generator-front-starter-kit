import gulp from 'gulp'
import svgmin from 'gulp-svgmin'
import changed from 'gulp-changed'
import plumber from 'gulp-plumber'
import { src, dest, errorHandler } from '../config'

gulp.task('svgo', () =>
  gulp
    .src(`${src.img}/svgo/**/*.svg`)
    .pipe(
      plumber({
        errorHandler,
      })
    )
    .pipe(changed(dest.img))
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
        plugins: [
          {
            removeDesc: true,
          },
          {
            cleanupIDs: true,
          },
          {
            mergePaths: false,
          },
        ],
      })
    )
    .pipe(gulp.dest(dest.img))
)

const build = () => gulp.series('svgo')
const watch = () => () => gulp.watch(`${src.img}/svgo/**/*.svg`, gulp.parallel('svgo'))

module.exports.build = build
module.exports.watch = watch
