module.exports = api => {
  api.cache(true)

  return {
    presets: ["@babel/env", "@babel/typescript", "@babel/react"],
    plugins: [
      ["relay", { artifactDirectory: "./src/__generated__" }],
      "@babel/plugin-proposal-class-properties",
    ],
  }
}
