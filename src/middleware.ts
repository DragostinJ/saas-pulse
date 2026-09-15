import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected application routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/organization(.*)"
]);

// 1. Mark the middleware callback as async
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 2. Await the protection method to pause execution until the session resolves
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!.*\\..*|_next).*)",
    "/",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Explicitly allow the Clerk proxy tunnel for Vercel
    "/__clerk/(.*)"
  ]
};