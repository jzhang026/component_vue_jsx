module.exports = {
  entry: "./main_vue.js",
  mode: "development",
  optimization: {
    minimize: false,
  },
  devtool: "eval-cheap-source-map",
  module: {
    rules: [
      {
        test: /\.?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                { pragma: "createElement" },
              ],
            ],
          },
        },
      },
      {
        test: /\.view/,
        use: {
          loader: require.resolve("./myloader.js"),
        },
      },
    ],
  },
};
