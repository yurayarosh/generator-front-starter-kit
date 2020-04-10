import gulp from 'gulp'
import plumber from 'gulp-plumber'
import spritesmith from 'gulp.spritesmith'
import buffer from 'vinyl-buffer'
import { src, dest, errorHandler} from '../config'

gulp.task('sprite-png', () => {
  const spriteData = gulp
    .src(`${src.icons}/*.png`)
    .pipe(
      plumber({
        errorHandler,
      })
    )
    .pipe(
      spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite-png.sass',
        imgPath: '../img/sprite.png',
        // retinaSrcFilter: src.iconsPng + '/*@2x.png',
        // retinaImgName: 'sprite@2x.png',
        // retinaImgPath: '../img/sprite@2x.png',
        padding: 10,
        algorithm: 'binary-tree',
        cssTemplate: `${__dirname}/sprite-png/sprite.template.mustache`,
        // ,
        // cssVarMap: function(sprite) {
        //     sprite.name = 'icon-' + sprite.name;
        // }
      })
    )
  spriteData.img.pipe(buffer()).pipe(gulp.dest(dest.img))
  spriteData.css.pipe(gulp.dest(src.stylesGen))

  return spriteData
})

const build = gulp => gulp.series('sprite-png')
const watch = gulp => () => gulp.watch(`${src.icons}/*.png`, gulp.parallel('sprite-png'))

module.exports.build = build
module.exports.watch = watch
