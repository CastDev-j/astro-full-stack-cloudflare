import { getActionContext } from "astro:actions";
import { defineMiddleware, sequence } from "astro:middleware";
import { env } from "cloudflare:workers";

const rateLimit = defineMiddleware(async (context, next) => {
  const { success } = await env.RATE_LIMIT.limit({
    key: context.url.pathname,
  });

  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  return next();
});

export const onRequest = sequence(rateLimit);
