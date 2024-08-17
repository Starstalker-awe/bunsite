import RateLimiter from "./rateLimiter";
import type { Elysia } from "elysia";

export const rateLimiter = (app: Elysia) => app
.decorate("RateLimiter", new RateLimiter())
.onRequest(({ RateLimiter, set, request }) => { if (!RateLimiter.accepted(app.server!.requestIP(request)!.address)) { return set.status = 420 }});

export { default as staticFiles } from "./static";

export { serveBlogs } from "./blogs";