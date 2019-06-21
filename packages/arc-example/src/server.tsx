require("dotenv").config()

import { buildServerApp } from "@artsy/arc"
import { createNetwork } from "@artsy/arc-network-middleware"
import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackConfig from "../webpack.config"
import { routes } from "./routes"

const compiler = webpack(webpackConfig)
const app = express()

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true,
    stats: "errors-only",
  })
)

app.get("/", async (req, res) => {
  try {
    const { bodyHTML, scripts, styleTags } = await buildServerApp({
      routes,
      url: req.url,
      getRelayEnvironment: () => createNetwork(),
    })

    res.send(
      getLayout({
        bodyHTML,
        scripts,
        styleTags,
      })
    )
  } catch (error) {
    console.error(error)
  }
})

const getLayout = ({ bodyHTML, scripts, styleTags }) => {
  return `
    <html>
      <head>
        <title>@artsy/arc</title>
        <link rel="stylesheet" type="text/css" href="https://webfonts.artsy.net/all-webfonts.css">
        <style type="text/css">${styleTags}</style>
      </head>
      <body>
        ${scripts}

        <div id="react">${bodyHTML}</div>
        <script src="/assets/app.js"></script>
      </body>
    </html>
  `
}

app.listen(3000, () => {
  console.warn("\nApp started at http://localhost:3000 \n")
})
