
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/workspace(.*)",
  "/projects(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    // Agar userId nahi hai, toh login page par redirect karein
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.\\..|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};