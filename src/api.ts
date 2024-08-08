import Elysia from "elysia";

const api = new Elysia({
  prefix: "/api",
})
  .get("/", () => ({ message: "Hello API" }))

export default api;