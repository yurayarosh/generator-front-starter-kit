import gulp from 'gulp'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import mqpacker from 'css-mqpacker'
import csso from 'postcss-csso'
import { src, dest, production, errorHandler } from '../config'

const isMax = mq => /max-width/.test(mq)
const isMin = mq => /min-width/.test(mq)

const sortMediaQueries = (a, b) => {
  const A = a.replace(/\D/g, '')
  const B = b.replace(/\D/g, '')

  if (isMax(a) && isMax(b)) {
    return B - A
  }
  if (isMin(a) && isMin(b)) {
    return A - B
  }
  if (isMax(a) && isMin(b)) {
    return 1
  }
  if (isMin(a) && isMax(b)) {
    return -1
  }
  return 1
}

const processors = [
  autoprefixer({
    cascade: false,
  }),
  mqpacker({
    sort: sortMediaQueries,
  }),
  csso,
]

gulp.task('sass', () =>
  gulp
    .src(`${src.styles}/*.{sass,scss}`)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: production ? 'compact' : 'expanded', // nested, expanded, compact, compressed
        precision: 5,
      })
    )
    .on('error', errorHandler)
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest.css))
)

const build = gulp => gulp.parallel('sass')
const watch = gulp => () => gulp.watch(`${src.styles}/**/*.{sass,scss}`, gulp.parallel('sass'))

module.exports.build = build
module.exports.watch = watch
