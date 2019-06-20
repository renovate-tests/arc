declare module "found" {
  interface ResolverUtils {
    checkResolved: () => any
    isResolved: () => any
    getRouteMatches: (match) => any
    getRouteValues: (routeMatches, routeQuery, query) => any
    getComponents: () => any
    accumulateRouteValues: () => any
  }

  const ResolverUtils: ResolverUtils
}

declare module "farce" {
  type HistoryProtocol = "browser" | "hash" | "memory"

  interface HistoryOptions {
    useBeforeUnload?: boolean
  }
}

declare module "found-relay"
declare module "found-scroll"
