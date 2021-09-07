import gulp from 'gulp'
import cheerio from 'gulp-cheerio'
import clean from 'gulp-cheerio-clean-svg'
import svgmin from 'gulp-svgmin'<% if (sprites.indexOf('inline-svg') !== -1) { %>
import rename from 'gulp-rename'<% } %>
import del from 'del'
import colors from 'ansi-colors'
import log from 'fancy-log'<% if (sprites.indexOf('inline-svg') !== -1) { %>
import { extname, basename } from 'path'<% } %><% if (sprites.indexOf('inline-svg') !== -1) { %>
import { src } from '../config'<% } %><% if (sprites.indexOf('inline-svg-lazy') !== -1) { %>
import { src, dest } from '../config'<% } %>
<% if (sprites.indexOf('inline-svg') !== -1) { %>
gulp.task('svgicons:clean', () =>
  del([`${src.iconsHTML}/*.html`]).then(paths => {
    log('Deleted:', colors.magenta(paths.join('\n')))
  })
)<% } %><% if (sprites.indexOf('inline-svg-lazy') !== -1) { %>
gulp.task('svgicons:clean', () =>
  del([`${dest.icons}/*.svg`]).then(paths => {
    log('Deleted:', colors.magenta(paths.join('\n')))
  })
)<% } %>

gulp.task('svgicons:create', () =>
  gulp
    .src(`${src.icons}/*.svg`)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
        plugins: [
          {
            removeXMLProcInst: true,
          },
          {
            removeComments: true,
          },
          {
            removeDoctype: true,
          },<% if (sprites.indexOf('inline-svg') !== -1) { %>
          {
            removeXMLNS: true,
          },<% } %>
          {
            convertStyleToAttrs: false,
          },
        ],
      })
    )
    .pipe(
      cheerio(
        clean({
          attributes: ['id', 'fill*', 'clip*', 'stroke*'],
        })
      )
    )
    .pipe(
      cheerio({
        run($<% if (sprites.indexOf('inline-svg') !== -1) { %>, file<% } %>) {<% if (sprites.indexOf('inline-svg') !== -1) { %>
          const { relative } = file
          const iconName = basename(relative, extname(relative))<% } %>
          const svg = $('svg')
          const svgStyle = svg.attr('style')

          if (svgStyle && svgStyle.indexOf('enable-background') !== -1) {
            svg.removeAttr('style')
          }

          const h = +svg.attr('height') || +svg.attr('viewBox').split(' ')[3]
          const w = +svg.attr('width') || +svg.attr('viewBox').split(' ')[2]
          if (!svg.attr('viewBox')) {
            svg.attr('viewBox', `0 0 ${w} ${h}`)
          }
          const height = '1em'
          const width = `${(w / h).toFixed(3)}em`
          <% if (sprites.indexOf('inline-svg') !== -1) { %>
          svg.attr('class', `{% if mod %}{{ mod }} {% endif %}icon icon--${iconName}`)<% } %>
          svg.attr('width', width)
          svg.attr('height', height)
        },<% if (sprites.indexOf('inline-svg') !== -1) { %>
        parserOptions: { xmlMode: false },<% } %>
      })
    )<% if (sprites.indexOf('inline-svg') !== -1) { %>
    .pipe(
      rename({
        prefix: '_',
        extname: '.html',
      })
    )
    .pipe(gulp.dest(src.iconsHTML))<% } %><% if (sprites.indexOf('inline-svg-lazy') !== -1) { %>
    .pipe(gulp.dest(dest.icons))<% } %>
)

const build = gulp => gulp.series('svgicons:clean', 'svgicons:create')
const watch = gulp => () =>
  gulp.watch(`${src.icons}/*`, gulp.parallel('svgicons:clean', 'svgicons:create'))

module.exports.build = build
module.exports.watch = watch
