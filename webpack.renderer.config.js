
const rules = require('./webpack.rules');

rules.push(
  {
    test: /\.css$/,
    use: [
      { loader: 'style-loader' }, { loader: 'css-loader' },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [require("tailwindcss"), require("autoprefixer")],
          },
        },
      },
    ],
  },
  {
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: 'asset/resource',
    // Si quieres que las imágenes se copien a una carpeta específica:
    generator: {
      filename: 'src/assets/img/[name][ext]'
    }
  }
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
