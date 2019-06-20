import React from "react"
import qs from "qs"
import { RouterConfig } from "./RouterConfig"

import { Resolver } from "found-relay"
import { ScrollManager } from "found-scroll"
import createInitialFarceRouter from "found/lib/createInitialFarceRouter"
import createRender from "found/lib/createRender"
import BrowserProtocol from "farce/lib/BrowserProtocol"
import createQueryMiddleware from "farce/lib/createQueryMiddleware"
import HashProtocol from "farce/lib/HashProtocol"
import MemoryProtocol from "farce/lib/MemoryProtocol"

interface Resolve {
  ClientApp: React.ComponentType<any>
}

export function buildClientApp(config: RouterConfig): Promise<Resolve> {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        routes = [],
        history = {},
        initialRoute = "/",
        getFarceConfig = () => ({}),
        getRelayEnvironment,
        renderWrapper,
      } = config

      const relayEnvironment = getRelayEnvironment()

      const getHistoryProtocol = () => {
        switch (history.protocol) {
          case "browser":
            return new BrowserProtocol()
          case "hash":
            return new HashProtocol()
          case "memory":
            return new MemoryProtocol(initialRoute)
          default:
            return new BrowserProtocol()
        }
      }

      const historyMiddlewares = [
        createQueryMiddleware({
          parse: qs.parse,
          stringify: qs.stringify,
        }),
      ]

      const resolver = new Resolver(relayEnvironment)

      const render = createRender({})

      const Router = await createInitialFarceRouter({
        historyProtocol: getHistoryProtocol(),
        historyMiddlewares,
        historyOptions: history.options,
        routeConfig: routes,
        resolver,
        render: renderArgs => (
          <ScrollManager renderArgs={renderArgs}>
            {render(renderArgs)}
          </ScrollManager>
        ),
        ...getFarceConfig(),
      })

      const ClientApp: any /* FIXME */ = () => {
        const FoundRouter = () => <Router resolver={resolver} />

        if (renderWrapper) {
          return renderWrapper({
            Router: FoundRouter,
            relayEnvironment,
            routes,
          })
        } else {
          return <FoundRouter />
        }
      }

      resolve({
        ClientApp,
      })
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
