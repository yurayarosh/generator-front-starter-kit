import gulp from 'gulp'
import { src, dest, staticPath } from '../config'

gulp.task('copy:img', () =>
  gulp
    .src([`${src.img}/**/*.{jpg,png,jpeg,svg,gif,webp}`, `!${src.img}/svgo/**/*.*`])
    .pipe(gulp.dest(dest.img))
)

gulp.task('copy:static', () =>
  gulp.src(`${staticPath}/**/*.*`).pipe(gulp.dest(dest.root))
)

const build = gulp =>
  gulp.series(
    'copy:img',    
    'copy:static',
  )
const watch = gulp => () => {
  gulp.watch(`${src.img}/**`, gulp.parallel('copy:img'))
  gulp.watch(`${staticPath}/**`, gulp.parallel('copy:static'))
}

module.exports.build = build
module.exports.watch = watch
