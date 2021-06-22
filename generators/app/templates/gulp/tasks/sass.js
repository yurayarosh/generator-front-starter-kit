import gulp from 'gulp'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'autoprefixer'
import postcss from 'gulp-postcss'
import csso from 'postcss-csso'
import postcssCustomProperties from 'postcss-custom-properties'
import { src, dest, production, errorHandler } from '../config'

const processors = [
  autoprefixer({
    cascade: false,
  }),
  csso,
  postcssCustomProperties(),
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
