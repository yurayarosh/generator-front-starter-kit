import gulp from 'gulp'
import browseeSync from 'browser-sync'
import { src, dest, production } from '../config'
const env = require('minimist')(process.argv.slice(2))

const server = browseeSync.create()

gulp.task('server', done => {
  server.init({
    server: {
      baseDir: !production ? [dest.root, src.root] : dest.root,
      directory: false,
      serveStaticOptions: {
        extensions: ['html'],
      },
    },
    files: [`${dest.html}/*.html`, `${dest.css}/*.css`, `${dest.img}/**/*`],
    port: env.port || 8080,
    logLevel: 'info', // 'debug', 'info', 'silent', 'warn'
    logConnections: false,
    logFileChanges: true,
    open: Boolean(env.open),
    notify: false,
    ghostMode: false,
    online: Boolean(env.tunnel),
  })
  done()
})

const build = gulp => gulp.parallel('server')

module.exports.build = build
module.exports.server = server
