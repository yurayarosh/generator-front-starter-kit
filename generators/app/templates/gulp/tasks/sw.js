import gulp from 'gulp'
import { generateSW } from 'workbox-build'
import { dest } from '../config'

// Don' t cache scripts and files if has theese words in path (admin panel, callback services etc.).
const urlPattern = ({ url }) =>
  ![
    'adminlte',
    'bootstrap',
    'pjax',
    'fontawesome',
    'font-awesome',
    'glyphicons',
    'all-skins',
    'gridview',
    'backend',
    'phpmyadmin',
    'google',
    'ringostat',
  ].find(excp => url.href.toLowerCase().includes(excp))

gulp.task('sw', () => {
  return generateSW({
    globDirectory: dest.root,
    globPatterns: ['**/*.{json,js,css,woff2,ico,png,jpg,svg,xml}'],
    globIgnores: [
      'assets/**',
      'img/**',
      'uploads/**',
      '*.map*',
      '*manifest',
      'sw.js',
      '.htaccess',
      'robots.txt',
    ],
    swDest: dest.sw,
    offlineGoogleAnalytics: true,
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    // Define runtime caching rules.
    runtimeCaching: [
      {
        // Match callback function. (https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-routing#%7EmatchCallback)
        urlPattern,
        // Apply a network-first strategy.
        handler: 'NetworkFirst',
        options: {
          // Use a custom cache name.
          cacheName: 'runtime-v1',
          // Plugins
          cacheableResponse: {
            statuses: [0, 200],
          },
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          },
        },
      },
    ],
  })
})

const build = gulp => gulp.parallel('sw')

module.exports.build = build
