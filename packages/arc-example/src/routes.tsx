import { App } from "./App"
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
