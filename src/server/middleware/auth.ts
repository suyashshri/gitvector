import { auth } from "@clerk/nextjs/server";
import { middleware } from "../trpc";
import { TRPCError } from "@trpc/server";

export const isAuthenticated = middleware(async ({ ctx, next }) => {
  const user = await auth();
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
