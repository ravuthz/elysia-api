import Elysia, { t } from "elysia";
import swagger from "@elysiajs/swagger";

import users from "./users";

const encoder = new TextEncoder()

const api = new Elysia({
  prefix: "/api",
})
  .use(swagger({
    path: '/api-docs',
    documentation: {
      info: {
        title: 'Elysia Documentation',
        version: '1.0.0',
        description: 'Elysia API Documentation',
      }
    }
  }))
  .onError(({ code, error, set }) => {
    let message = null;

    if (code === 'NOT_FOUND') {
      message = error.message || 'Not found';
    }

    if (code == 'PARSE') {
      message = error.message || 'Invalid JSON';
    }

    if (code === 'VALIDATION') {
      message = error.message || 'Validation failed';
    }

    return {
      error,
      status: set.status || 500,
      message: message || 'Internal Server Error'
    }
  })
  .mapResponse((opts) => {
    const { response, set, request: { url } } = opts;
    const isJson = typeof response === 'object'

    if (url.endsWith('/api-docs')) {
      return response;
    }

    const text = isJson
    ? JSON.stringify(response)
    : JSON.stringify({
      status: set.status || 200,
      ...response
    })

    set.headers['Content-Encoding'] = 'gzip'

    return new Response(
      Bun.gzipSync(encoder.encode(text)),
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    )
  })
  .get("/", () => ({ message: "API" }))
  .group("/users", (app) => app.use(users))


export default api;