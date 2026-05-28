import { SignUp } from "@clerk/nextjs";

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
      "bg-[#E8D5B7] text-[#1B4332] hover:bg-[#F0E4CE] border-none",
    footerActionLink: "text-[#E8D5B7] hover:text-[#F0E4CE]",
    identityPreviewEditButton: "text-[#E8D5B7]",
    formFieldInput: "border-white/10 bg-white/5 text-white",
    dividerLine: "bg-white/10",
    dividerText: "text-white/40",
    socialButtonsBlockButton:
      "border-white/10 bg-white/5 text-white hover:bg-white/10",
    navbar: "hidden",
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-[#0d2818] px-6 py-12">
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
