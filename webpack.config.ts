import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import InlineChunkHtmlPlugin from 'inline-chunk-html-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { EnvironmentPlugin, Configuration } from 'webpack';
import merge from 'webpack-merge';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { electronConfig } from './config/webpack/electron.config';
import { preloadConfig } from './config/webpack/preload.config';
import { reactConfig } from './config/webpack/react.config';
import ElectronDevPlugin from './config/webpack/plugin/ElectronDevPlugin';

//Always attach this to the fist config for a proper cleanup on start.
const cleanOutputConfig: Configuration = {
  plugins: [new CleanWebpackPlugin()],
};

const writeToDiskFiles = [/.*main.js/, /.*preload.js/];

// Add this to the last config in development mode for the dev server.
const devServerConfig: Configuration = {
  plugins: [new ElectronDevPlugin()],
  devServer: {
    static: path.join(__dirname, 'build'),
    historyApiFallback: true,
    hot: true,
    devMiddleware: {
      writeToDisk: (filename) => writeToDiskFiles.some((it) => it.test(filename)),
    },
  },
};

const devConfig: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    // use 'development' unless process.env.NODE_ENV is defined
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      ELECTRON_START_URL: 'http://localhost:8080',
      DEBUG: false,
    }),
  ],
};

const prodConfig: Configuration = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin(), new HtmlMinimizerPlugin()],
  },
  plugins: [new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]), new HTMLInlineCSSWebpackPlugin()],
  performance: {
    hints: false,
  },
};

module.exports = (env: { production: boolean }): Configuration[] => {
  const configurations: Configuration[] = [];

  if (env?.production) {
    configurations.push(merge(merge(electronConfig, cleanOutputConfig), prodConfig));
    configurations.push(merge(preloadConfig, prodConfig));
    configurations.push(merge(reactConfig, prodConfig));
  } else {
    configurations.push(merge(merge(electronConfig, cleanOutputConfig), devConfig));
    configurations.push(merge(preloadConfig, devConfig));
    configurations.push(merge(merge(reactConfig, devServerConfig), devConfig));
  }

  return configurations;
};
