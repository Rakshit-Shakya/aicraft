import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson";
import { auth } from "@clerk/nextjs/server";

type Context = {
  userId: string | null;
};


export const createTRPCContext = cache(async (): Promise<Context> => {
  const { userId } = await auth();
  return { userId };
});


const t = initTRPC.context<Context>().create({
  transformer: superjson,
});


const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      userId: ctx.userId,
    },
  });
});

export const protectedProcedure = t.procedure.use(authMiddleware);

// Base exports
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

