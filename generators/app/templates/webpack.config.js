import webpack from 'webpack'
import path from 'path'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { src, dest } from './gulp/config'

function createConfig(env) {
  if (!env) env = process.env.NODE_ENV
  const isProduction = env === 'production'

  const webpackConfig = {
    mode: isProduction ? 'production' : 'development',
    context: path.join(__dirname, src.js),
    entry: {
      app: './app',
      polyfills: './polyfills',
    },
    output: {
      path: path.join(__dirname, dest.js),
      filename: '[name].js',
      publicPath: 'js/',
    },
    devtool: isProduction ? '#source-map' : '#cheap-module-eval-source-map',
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),

      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        analyzerPort: 4000,
        openAnalyzer: false,
      }),
    ],
    optimization: {
      minimize: isProduction,
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: [path.resolve(__dirname, 'node_modules')],
          loader: 'eslint-loader',
          options: {
            fix: true,
            cache: true,
            ignorePattern: `${__dirname}/src/js/lib/`,
          },
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [path.resolve(__dirname, 'node_modules')],
        },
        {
          test: /\.glsl$/,
          loader: 'webpack-glsl-loader',
        },
      ],
    },
  }

  if (isProduction) {
    webpackConfig.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      })
    )
  }

  return webpackConfig
}

module.exports = createConfig()
module.exports.createConfig = createConfig
