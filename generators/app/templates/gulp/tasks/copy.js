import gulp from 'gulp'
import { src, dest } from '../config'

gulp.task('copy:img', () =>
  gulp
    .src([`${src.img}/**/*.{jpg,png,jpeg,svg,gif,webp}`, `!${src.img}/svgo/**/*.*`])
    .pipe(gulp.dest(dest.img))
)

gulp.task('copy:fonts', () =>
  gulp.src(`${src.fonts}/*.{woff,woff2}`).pipe(gulp.dest(dest.fonts))
)

gulp.task('copy:video', () =>
  gulp.src(`${src.video}/**/*.*`).pipe(gulp.dest(dest.video))
)

gulp.task('copy:data', () =>
  gulp.src(`${src.data}/**/*.*`).pipe(gulp.dest(dest.data))
)

gulp.task('copy:rootfiles', () =>
  gulp.src(`${src.root}/*.*`).pipe(gulp.dest(dest.root))
)

const build = gulp =>
  gulp.series(
    'copy:img',
    // 'copy:rootfiles',
    // 'copy:data',
    // 'copy:video',
    'copy:fonts',
  )
const watch = gulp => () => gulp.watch(`${src.img}/*`, gulp.parallel('copy:img'))

module.exports.build = build
module.exports.watch = watch
