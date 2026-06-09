import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchProfileByClerkId } from "@/lib/user-profile-server";

const isProtectedRoute = createRouteMatcher([
  "/api/profile(.*)",
  "/api/deals(.*)",
  "/api/venura-ai(.*)",
  "/api/usage(.*)",
  "/api/analysis-history(.*)",
  "/analyzer(.*)",
  "/saved-deals(.*)",
  "/compare(.*)",
  "/projections(.*)",
  "/portfolio(.*)",
  "/deal-alerts(.*)",
  "/venura-ai(.*)",
  "/pricing(.*)",
  "/settings(.*)",
  "/dashboard(.*)",
  "/onboarding(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/hoa(.*)",
  "/rent(.*)",
  "/cost(.*)",
  "/rvb(.*)",
  "/guide(.*)",
  "/quiz(.*)",
  "/markets(.*)",
  "/widget(.*)",
  "/mortgage(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

const isApiRoute = createRouteMatcher([
  "/api(.*)",
  "/trpc(.*)",
  "/__clerk(.*)",
]);

const isCheckoutRoute = createRouteMatcher(["/api/checkout(.*)"]);

const isStripeWebhook = createRouteMatcher(["/api/webhooks/stripe(.*)"]);

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default clerkMiddleware(
  {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
    ...(appUrl ? { authorizedParties: [appUrl.replace(/\/$/, "")] } : {}),
  },
  async (auth, req) => {
    if (isStripeWebhook(req)) return;

    if (isProtectedRoute(req) || isCheckoutRoute(req)) {
      await auth.protect();
    }

    const { userId } = await auth();
    if (!userId) return;

    if (isPublicRoute(req) || isApiRoute(req)) return;

    let onboardingCompleted = false;
    try {
      const profile = await fetchProfileByClerkId(userId);
      onboardingCompleted = profile?.onboarding_completed ?? false;
    } catch (error) {
      console.error("Middleware profile check failed:", error);
      if (!isOnboardingRoute(req)) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      return;
    }

    if (isOnboardingRoute(req)) {
      if (onboardingCompleted) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return;
    }

    if (!onboardingCompleted) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
