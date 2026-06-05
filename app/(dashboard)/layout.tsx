import { Sidebar } from "@/components/dashboard/sidebar";
import { ProfileSync } from "@/components/profile/profile-sync";
import { SubscriptionProvider } from "@/components/subscription/subscription-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-[#0d2818] font-sans text-white">
      <SubscriptionProvider>
      <ProfileSync />
      <Sidebar />
      <main className="min-h-full pl-64">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
          {children}
        </div>
      </main>
      </SubscriptionProvider>
    </div>
  );
}
