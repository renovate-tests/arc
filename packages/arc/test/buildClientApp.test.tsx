import { createNetwork } from "@artsy/arc-network-middleware"
import { mount } from "enzyme"
import React from "react"
import { buildClientApp } from "../src/buildClientApp"

describe("makeClientApp", () => {
  it("resolves with a <ClientApp /> component", async () => {
    const { ClientApp } = await buildClientApp({
      history: {
        protocol: "memory",
      },
      routes: [
        {
          path: "/",
          Component: () => <div>Hello Router</div>,
        },
        {
          path: "/cv",
          Component: () => <div>CV Page</div>,
        },
      ],
      getRelayEnvironment: () => {
        return createNetwork()
      },
    })

    const wrapper = mount(<ClientApp />)
    expect(wrapper.html()).toContain("<div>Hello Router</div>")
  })

  it("accepts an initial route", async () => {
    const { ClientApp } = await buildClientApp({
      history: {
        protocol: "memory",
      },
      initialRoute: "/cv",
      routes: [
        {
          path: "/",
          Component: () => <div>Hello Router</div>,
        },
        {
          path: "/cv",
          Component: () => <div>CV Page</div>,
        },
      ],
      getRelayEnvironment: () => {
        return createNetwork()
      },
    })

    const wrapper = mount(<ClientApp />)
    expect(wrapper.html()).toContain("<div>CV Page</div>")
  })

  it("bootstraps data from __RELAY_BOOTSTRAP__", async () => {
    window.__RELAY_BOOTSTRAP__ = [
      [
        '{"queryID":"OrderQuery","variables":{"orderID":"0"}}',
        "found window cache",
      ],
    ]

    const { ClientApp } = await buildClientApp({
      history: {
        protocol: "memory",
      },
      routes: [
        {
          path: "/",
          Component: () => <div>Hello Router</div>,
        },
        {
          path: "/cv",
          Component: () => <div>CV Page</div>,
        },
      ],
      getRelayEnvironment: () => {
        return createNetwork()
      },
    })

    const wrapper = mount(<ClientApp />)

    expect(
      (wrapper
        .find("ScrollManager")
        .props() as any).relayEnvironment.relaySSRMiddleware.cache.values()
    ).toContain("found window cache")
  })
})

declare global {
  interface Window {
    __RELAY_BOOTSTRAP__: any
  }
}
