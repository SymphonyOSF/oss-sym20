const path = require('path');
const Sym20WebpackPlugin = require('@sym20/extension-webpack-plugin');

const LOCAL_DOMAIN = 'local-dev.symphony.com';
const LOCAL_PORT = 9030;

module.exports = {
  mode: (process.env.NODE_ENV === 'development') ? 'development' : 'production',
  devtool: (process.env.NODE_ENV === 'development') ? 'inline-source-map' : 'source-map',

  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new Sym20WebpackPlugin({
      name: 'Hello World Symphony 2.0 extension',
      cwd: './dist',
      files: [
        './extension.js'
      ]
    })
  ],

  // Used when running webpck-dev-server
  devServer: {
    https: {
      cert: require.resolve('@sym20/extension-webpack-plugin/dev-certs/local-dev.symphony.com.crt'),
      key: require.resolve('@sym20/extension-webpack-plugin/dev-certs/local-dev.symphony.com.key')
    },
    port: LOCAL_PORT,
    host: '0.0.0.0',
    sockPort: LOCAL_PORT,
    sockHost: LOCAL_DOMAIN,
    contentBase: './dist',
    publicPath: '/ext',
    inline: true,
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    proxy: {
      '/**': {
        target: process.env.POD_TARGET,
        changeOrigin: true,
        hostRewrite: true,
        cookieDomainRewrite: LOCAL_DOMAIN,
        secure: false,
        logLevel: 'debug',
      },
    },
  }
};
