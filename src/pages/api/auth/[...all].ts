import { auth } from "@/lib/auth";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (ctx) => {
  console.log("route called", ctx.request.url);

  return auth.handler(ctx.request);
};
