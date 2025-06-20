import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

console.log("Initializing tRPC...");

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
// export const protectedProcedure = t.procedure.use(isAuthenticated);
