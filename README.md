### @artsy/arc

A lightweight SSR routing framework for Relay Modern.

### WIP

#### Example

```tsx
// routes.tsx

import { graphql } from "react-relay"

export const routes = [
  {
    path: "/",
    Component: App,
    query: graphql`
      query routes_Query {
        artworks {
          artist {
            name
            bio
          }
        }
      }
    `,
  },
]
```

```tsx
// server.tsx

import express from "express"
import { routes } from "./routes"
import { buildServerApp } from "@artsy/arc"
import { createNetwork } from "@artsy/arc-network-middleware"

const app = express()

app.get("/", async (req, res, next) => {
  try {
    const { bodyHTML, scripts, styleTags } = await buildServerApp({
      routes,
      url: req.url,
      getRelayEnvironment: () => {
        return createNetwork({
          url: "https://metaphysics-production.artsy.net",
        })
      },
    })

    res.send(`
      <html>
        <head>
          <title>@artsy/arc</title>
          <style type="text/css">${styleTags}</style>
        </head>
        <body>
          ${scripts}

          <div id="react">${bodyHTML}</div>
          <script src="/assets/app.js"></script>
        </body>
      </html>
    `)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
```

```tsx
// client.tsx

import React from "react"
import ReactDOM from "react-dom"
import { routes } from "./routes"
import { buildClientApp } from "@artsy/arc"
import { createNetwork, loggerMiddleware } from "@artsy/arc-network-middleware"

try {
  const { ClientApp } = await buildClientApp({
    routes,
    getRelayEnvironment: () => {
      return createNetwork({
        url: "https://metaphysics-production.artsy.net",
        middleware: [loggerMiddleware()],
      })
    },
  })

  ReactDOM.hydrate(<ClientApp />, document.getElementById("react"))
} catch (error) {
  console.error(error)
}
```
