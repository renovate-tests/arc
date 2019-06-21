/**
 * @jest-environment node
 */

import { createNetwork } from "@artsy/arc-network-middleware"
import { render } from "enzyme"
import React from "react"
import ReactDOMServer from "react-dom/server"
import styled from "styled-components"
import { __SERVER_APP_TEST__, buildServerApp } from "../src/buildServerApp"

describe("buildServerApp", () => {
  const getWrapper = async ({
    url = "/",
    Component = () => <div>hi!</div>,
    ...options
  }: any = {}) => {
    const result = await buildServerApp({
      routes: [
        {
          path: "/",
          Component,
        },
        {
          path: "/hello",
          Component: () => <div>how are you</div>,
        },
      ],
      url,
      getRelayEnvironment: () => {
        return createNetwork()
      },
      ...options,
    })

    const ServerApp = Object.getOwnPropertyDescriptor(
      result,
      __SERVER_APP_TEST__
    ).value

    return {
      ...result,
      ServerApp,
      wrapper: render(<ServerApp />),
    }
  }

  it("resolves with a rendered version of the ServerApp component", async () => {
    const { ServerApp, bodyHTML } = await getWrapper()
    expect(bodyHTML).toEqual(ReactDOMServer.renderToString(<ServerApp />))
  })

  it("resolves correct html when setting a route", async () => {
    const { bodyHTML } = await getWrapper({ url: "/hello" })
    expect(bodyHTML).toContain("how are you")
  })

  it("bootstraps relay SSR data", async () => {
    const { scripts } = await getWrapper()
    expect(scripts).toContain("__RELAY_BOOTSTRAP__")
  })

  it("resolves with a 200 status if url matches request", async () => {
    const { status } = await getWrapper({ url: "/" })
    expect(status).toEqual(200)
  })

  it("resolves with a 404 status if url does not match request", async () => {
    const { status } = await getWrapper({ url: "/bad-url" })
    expect(status).toEqual(404)
  })

  it("passes along rendered css", async () => {
    const { styleTags } = await getWrapper({
      Component: styled.div`
        background: green;
      `,
    })
    expect(styleTags).toContain("style data-styled")
    expect(styleTags).toContain("background:green")
  })
})
