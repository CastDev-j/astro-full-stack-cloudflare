import { handle } from "@astrojs/cloudflare/handler";
import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject<Env> {
  private value: number = 0;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      const saved = await this.ctx.storage.get<number>("value");
      if (saved !== undefined) this.value = saved;
    });
  }

  get(){
    return this.value
  }

  

}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;