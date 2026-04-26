import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/inngest(.*)",
  //"/api/trpc(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();

  // TS-safe access
  const userId = authData?.userId;

  if (!isPublicRoute(req) && !userId) {
    return Response.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};



