"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getInvestorProfile } from "@/lib/investor-profile";

export function SignUpWithProfile() {
  const [ready, setReady] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string | undefined>();

  useEffect(() => {
    const profile = getInvestorProfile();
    if (profile?.email) {
      setEmailAddress(profile.email);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="mx-auto h-96 w-full max-w-md" aria-hidden />;
  }

  return (
    <SignUp
      appearance={clerkAppearance}
      initialValues={emailAddress ? { emailAddress } : undefined}
      forceRedirectUrl="/onboarding"
    />
  );
}
