import gulp from 'gulp'
import config from './gulp/config'

const getTaskBuild = task => require(`./gulp/tasks/${task}`).build(gulp)
const getTaskWatch = task => require(`./gulp/tasks/${task}`).watch(gulp)

gulp.task('clean', getTaskBuild('clean'))<% if (sprites.indexOf('inline-svg') !== -1) { %>
gulp.task('svgicons', getTaskBuild('svgicons'))<% } %><% if (sprites.indexOf('png') !== -1) { %>
gulp.task('sprite-png', getTaskBuild('sprite-png'))<% } %><% if (sprites.indexOf('sprite-svg') !== -1) { %>
gulp.task('sprite:svg', () => getTaskBuild('sprite-svg'))<% } %>
gulp.task('copy', getTaskBuild('copy'))
gulp.task('server', () => getTaskBuild('server'))
gulp.task('nunjucks', () => getTaskBuild('nunjucks'))
gulp.task('sass', () => getTaskBuild('sass'))
gulp.task('svgo', () => getTaskBuild('svgo'))<% if (preview) { %>
gulp.task('list-pages', getTaskBuild('list-pages'))<% } %>
gulp.task('webpack', getTaskBuild('webpack'))

gulp.task('copy:watch', getTaskWatch('copy'))<% if (sprites.indexOf('inline-svg') !== -1) { %>
gulp.task('svgicons:watch', getTaskWatch('svgicons'))<% } %><% if (sprites.indexOf('png') !== -1) { %>
gulp.task('sprite-png:watch', getTaskWatch('sprite-png'))<% } %><% if (sprites.indexOf('sprite-svg') !== -1) { %>
gulp.task('sprite:svg:watch', getTaskWatch('sprite-svg'))<% } %>
gulp.task('nunjucks:watch', getTaskWatch('nunjucks'))
gulp.task('sass:watch', getTaskWatch('sass'))
gulp.task('svgo:watch', getTaskWatch('svgo'))<% if (preview) { %>
gulp.task('list-pages:watch', getTaskWatch('list-pages'))<% } %>
gulp.task('webpack:watch', getTaskWatch('webpack'))

const setmodeProd = done => {
  config.setEnv('production')
  config.logEnv()
  done()
}

const setmodeDev = done => {
  config.setEnv('development')
  config.logEnv()
  done()
}

gulp.task(
  'build',
  gulp.series(
    setmodeProd,
    'clean',<% if (sprites.indexOf('inline-svg') !== -1) { %>
    'svgicons',<% } %><% if (sprites.indexOf('png') !== -1) { %>
    'sprite-png',<% } %><% if (sprites.indexOf('sprite-svg') !== -1) { %>
    'sprite:svg',<% } %>
    'svgo',
    'sass',
    'nunjucks',
    'webpack',<% if (preview) { %>
    'list-pages',<% } %>
    'copy'
  )
)

gulp.task(
  'build:dev',
  gulp.series(
    setmodeDev,
    'clean',<% if (sprites.indexOf('inline-svg') !== -1) { %>
    'svgicons',<% } %><% if (sprites.indexOf('png') !== -1) { %>
    'sprite-png',<% } %><% if (sprites.indexOf('sprite-svg') !== -1) { %>
    'sprite:svg',<% } %>
    'svgo',
    'sass',
    'nunjucks',
    'webpack',<% if (preview) { %>
    'list-pages',<% } %>
    'copy'
  )
)

gulp.task(
  'watch',
  gulp.parallel(
    'copy:watch',<% if (sprites.indexOf('inline-svg') !== -1) { %>
    'svgicons:watch',<% } %><% if (sprites.indexOf('png') !== -1) { %>
    'sprite-png:watch',<% } %><% if (sprites.indexOf('sprite-svg') !== -1) { %>
    'sprite:svg:watch',
    <% } %>
    'nunjucks:watch',
    'svgo:watch',<% if (preview) { %>
    'list-pages:watch',<% } %>
    'webpack:watch',
    'sass:watch'
  )
)

gulp.task('default', gulp.series(['build:dev', 'server', 'watch']))
