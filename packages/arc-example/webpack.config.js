const path = require("path")
const webpack = require("webpack")

module.exports = {
  mode: "development",
  devtool: "eval",
  entry: {
    app: "./src/client.tsx",
  },
  output: {
    filename: "[name].js",
    publicPath: "/assets",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: /src/,
        use: {
          loader: "babel-loader",
        },
      },
      // ESM support. See: https://github.com/apollographql/react-apollo/issues/1737#issuecomment-371178602
      {
        type: "javascript/auto",
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
    modules: ["node_modules", "src"],
  },
}
