import "isomorphic-fetch"
import "regenerator-runtime/runtime"

import RelayClientSSR from "react-relay-network-modern-ssr/node8/client"
import RelayServerSSR from "react-relay-network-modern-ssr/node8/server"
import { Environment, RecordSource, Store } from "relay-runtime"

import {
  RelayNetworkLayer,
  urlMiddleware,
  cacheMiddleware,
  loggerMiddleware,
} from "react-relay-network-modern"

export * from "react-relay-network-modern"

const isServer = typeof window === "undefined"

export function createNetwork({
  cache = getDefaultCache(),
  middleware = [],
} = {}) {
  const relaySSRMiddleware = isServer
    ? new RelayServerSSR()
    : new RelayClientSSR(cache)

  const network = new RelayNetworkLayer([
    relaySSRMiddleware.getMiddleware({
      lookup: true,
    }),
    cacheMiddleware({
      // max 100 requests
      size: 100,
      // 15 minutes
      ttl: 900000,

      /**
       * During the client-side rehydration phase take SSR cache and add to
       * Relay's QueryResponseCache, which is used inside of cacheMiddleware.
       * See: https://facebook.github.io/relay/docs/en/network-layer.html#caching
       */
      onInit: relayStore => {
        if (isServer) {
          return
        }
        if (!cache.length) {
          return
        }

        try {
          cache.forEach(request => {
            const [key, json] = request
            const { queryID, variables } = JSON.parse(key)
            ;(relayStore as any).set(queryID, variables, json)
          })
        } catch (error) {
          console.error(error)
        }
      },
    }),

    urlMiddleware({
      url: "https://metaphysics-production.artsy.net",
    }),

    ...middleware,
  ])

  const source = new RecordSource()
  const store = new Store(source)
  const environment = new Environment({
    network,
    store,
  })

  environment.relaySSRMiddleware = relaySSRMiddleware

  return environment
}

function getDefaultCache() {
  const cache = isServer
    ? []
    : //
      // @ts-ignore
      window.__RELAY_BOOTSTRAP__
  return cache
}
