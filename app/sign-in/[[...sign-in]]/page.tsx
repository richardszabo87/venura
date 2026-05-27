import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    colorPrimary: "#1B4332",
    colorBackground: "#1B4332",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255, 255, 255, 0.7)",
    colorInputBackground: "rgba(255, 255, 255, 0.05)",
    colorInputText: "#ffffff",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "bg-[#1B4332] border border-white/10 shadow-2xl",
    headerTitle: "text-white",
    headerSubtitle: "text-white/60",
    formButtonPrimary:
      "bg-[#74C69D] text-[#1B4332] hover:bg-[#95D5B2] border-none",
    footerActionLink: "text-[#74C69D] hover:text-[#95D5B2]",
    identityPreviewEditButton: "text-[#74C69D]",
    formFieldInput: "border-white/10 bg-white/5 text-white",
    dividerLine: "bg-white/10",
    dividerText: "text-white/40",
    socialButtonsBlockButton:
      "border-white/10 bg-white/5 text-white hover:bg-white/10",
    navbar: "hidden",
  },
};

export default function SignInPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-[#0d2818] px-6 py-12">
      <SignIn appearance={clerkAppearance} />
    </div>
  );
}
