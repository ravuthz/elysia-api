import { Server } from "bun";
import { Elysia } from "elysia";

import routers from "./routes";

const app = new Elysia()
  .use(routers.build())
  .get("/", () => "Hello Elysia")
  .listen(Bun.env.PORT || 3000);

const { hostname, port } = app.server as Server;

console.log(
  `🦊 Elysia is running at http://${hostname}:${port}`
);