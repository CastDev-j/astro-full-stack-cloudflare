import { getActionContext } from "astro:actions";
import { defineMiddleware, sequence } from "astro:middleware";
import { env } from "cloudflare:workers";
import { auth } from "./lib/auth";

const privateRoutes = ["/", "/todos"];
const authRoutes = ["/auth/login", "/auth/register"];

const rateLimit = defineMiddleware(async (context, next) => {
  const { success } = await env.RATE_LIMIT.limit({
    key: context.url.pathname,
  });

  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  return next();
});

const authMiddleware = defineMiddleware(async (context, next) => {
  const { action } = getActionContext(context);

  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;    
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  if (action) {
    return next();
  }

  if (privateRoutes.includes(context.url.pathname) && !isAuthed) {
    return context.redirect("/auth/login");
  }

  if (authRoutes.includes(context.url.pathname) && isAuthed) {
    return context.redirect("/");
  }

  return next();
});

export const onRequest = sequence(rateLimit, authMiddleware);
