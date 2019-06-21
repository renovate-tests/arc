import { graphql } from "react-relay"
import { App } from "./App"

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
