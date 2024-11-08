import Elysia, { Context } from "elysia";
import swagger from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { serverTiming } from "@elysiajs/server-timing";

import users from "./users";

const encoder = new TextEncoder()

const api = new Elysia({
  prefix: "/api",
  serve: {
    maxRequestBodySize: 1024 * 1024 * 512 // 512MB
  },
})
  .use(cors())
  .use(serverTiming())
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
    let status = 500;
    let message = 'Internal Server Error';
    let details: Array<string> = [];

    set.status = status;

    if (code === 'NOT_FOUND') {
      status = 404;
      message = error.message || 'Not found';
    }

    if (code == 'PARSE') {
      status = 400;
      message = error.message || 'Invalid JSON';
    }

    if (code === 'VALIDATION') {
      status = 400;
      message = error.message || 'Validation failed';
    }

    if (error.name.indexOf('PrismaClient') !== -1) {
      status = 422;
      details = error.message?.split('\n');
      message = details.at(-1) || 'Validation failed';
    }

    return { status, message, details }
  })
  .mapResponse((opts: Context) => {
    const { response, set, request: { url } } = opts;
    const isJson = typeof response === 'object'
    const status = set.status || 200;

    if (url.includes('/api/api-docs')) {
      return response;
    }

    const text = !isJson ? JSON.stringify({ status, ...response }) : JSON.stringify(response);

    set.headers['Content-Encoding'] = 'gzip'

    return new Response(
      Bun.gzipSync(encoder.encode(text)),
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    )
  })
  .get("/", () => ({ message: "API" }))
  .use(users)

export default api;