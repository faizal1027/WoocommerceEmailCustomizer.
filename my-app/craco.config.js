// js/my-app/craco.config.js

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Apply optimizations for production build
      if (env === "production") {
        // Disable complex code splitting for stability during recovery
        webpackConfig.optimization.splitChunks = false;
        webpackConfig.optimization.runtimeChunk = false;

        // Keep simplified filenames for easier WordPress integration
        webpackConfig.output.filename = "static/js/[name].js";
        webpackConfig.output.chunkFilename = "static/js/[name].chunk.js";

        // CSS filename configuration
        const miniCssExtractPlugin = webpackConfig.plugins.find(
          (plugin) => plugin instanceof MiniCssExtractPlugin
        );
        if (miniCssExtractPlugin) {
          miniCssExtractPlugin.options.filename = "static/css/[name].css";
          miniCssExtractPlugin.options.chunkFilename = "static/css/[name].chunk.css";
        }

        /* // Add compression plugin for gzip
        webpackConfig.plugins.push(
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240, // Only compress files larger than 10KB
            minRatio: 0.8,
          })
        ); */
      }
      return webpackConfig;
    },
  },
};
