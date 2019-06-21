import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"

Enzyme.configure({
  adapter: new Adapter(),
})

if (typeof window !== "undefined") {
  window.__RELAY_BOOTSTRAP__ = []
  window.scrollTo = jest.fn()
}
