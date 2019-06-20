import React from "react"
import ReactDOM from "react-dom"
import { buildClientApp } from "@artsy/arc"
import { routes } from "routes"
import { createNetwork, loggerMiddleware } from "@artsy/arc-network-middleware"

buildClientApp({
  routes,
  getRelayEnvironment: () => {
    return createNetwork({
      middleware: [loggerMiddleware()],
    })
  },
})
  .then(({ ClientApp }) => {
    ReactDOM.hydrate(<ClientApp />, document.getElementById("react"))
  })
  .catch(error => {
    console.error(error)
  })

if (module.hot) {
  module.hot.accept()
}
