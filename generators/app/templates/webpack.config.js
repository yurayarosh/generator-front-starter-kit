import webpack from 'webpack'
import ESLintPlugin from 'eslint-webpack-plugin'
import { resolve, join } from 'path'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { src, dest } from './gulp/config'

function createConfig(env) {
  if (!env) env = process.env.NODE_ENV
  const isProduction = env === 'production'

  const webpackConfig = {
    mode: env,
    context: join(__dirname, src.js),
    entry: {
      app: './app',
      polyfills: './polyfills',
    },
    output: {
      path: join(__dirname, dest.js),
      filename: '[name].js',
      publicPath: 'js/',
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        analyzerPort: 4000,
        openAnalyzer: false,
      }),
      new ESLintPlugin({
        fix: true,
      }),
    ],
    optimization: {
      minimize: isProduction,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [resolve(__dirname, 'node_modules')],
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
