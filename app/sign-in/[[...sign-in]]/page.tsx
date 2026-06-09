import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-[#0d2818] px-6 py-12">
      <SignIn appearance={clerkAppearance} forceRedirectUrl="/onboarding" />
    </div>
  );
}
