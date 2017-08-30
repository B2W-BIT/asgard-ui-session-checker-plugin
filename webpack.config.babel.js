import path from "path";
import {NormalModuleReplacementPlugin} from "webpack"
import config from "./package.json";

export default  {
  entry: {
    main: "./src/js/main.js"
  },
  output: {
    path: path.resolve(__dirname, `dist/${config.name}`),
    filename: "[name].js"
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)/i,
        loader: "babel",
        exclude: /node_modules/,
        query: {
          cacheDirectory: true
        }
      }
    ]
  },
  plugins: [
    new NormalModuleReplacementPlugin(/^(react|react\/addons)$/,
      path.resolve(__dirname, "ReactWindowWebpackWrapper"))
  ],
  resolve: {
    extensions: ["", ".jsx", ".js"]
  }
};

