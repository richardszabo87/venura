import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchProfileByClerkId } from "@/lib/user-profile-server";

const isProtectedRoute = createRouteMatcher([
  "/api/profile(.*)",
  "/api/deals(.*)",
  "/api/venura-ai(.*)",
  "/analyzer(.*)",
  "/saved-deals(.*)",
  "/compare(.*)",
  "/projections(.*)",
  "/portfolio(.*)",
  "/deal-alerts(.*)",
  "/venura-ai(.*)",
  "/pricing(.*)",
  "/dashboard(.*)",
  "/onboarding(.*)",
]);

const requiresOnboarding = createRouteMatcher([
  "/analyzer(.*)",
  "/saved-deals(.*)",
  "/compare(.*)",
  "/projections(.*)",
  "/portfolio(.*)",
  "/deal-alerts(.*)",
  "/venura-ai(.*)",
  "/pricing(.*)",
  "/dashboard(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const { userId } = await auth();
  if (!userId) return;

  if (!requiresOnboarding(req) && !isOnboardingRoute(req)) {
    return;
  }

  let onboardingCompleted = false;
  try {
    const profile = await fetchProfileByClerkId(userId);
    onboardingCompleted = profile?.onboarding_completed ?? false;
  } catch (error) {
    console.error("Middleware profile check failed:", error);
    return;
  }

  if (isOnboardingRoute(req) && onboardingCompleted) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (requiresOnboarding(req) && !onboardingCompleted) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
