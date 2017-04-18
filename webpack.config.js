const path = require('path');

module.exports = {
  entry: './src/loader.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simple-loader.js',
    library: "SimpleLoader",
    libraryTarget: "umd"
  },
  devtool: "source-map",
  target: "web"
};
