import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/quiz(.*)",
  "/hoa(.*)",
  "/rent(.*)",
  "/markets(.*)",
  "/cost(.*)",
  "/rvb(.*)",
  "/guide(.*)",
  "/mortgage(.*)",
  "/widget(.*)",
  "/schools(.*)",
  "/api/public(.*)",
  "/api/webhooks/stripe(.*)",
]);

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default clerkMiddleware(
  async (auth, req) => {
    try {
      if (!isPublicRoute(req)) {
        await auth.protect();
      }
    } catch (error) {
      console.error("Clerk middleware error:", error);
      return NextResponse.next();
    }
  },
  {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
    ...(appUrl ? { authorizedParties: [appUrl.replace(/\/$/, "")] } : {}),
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
