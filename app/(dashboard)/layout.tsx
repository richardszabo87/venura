import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-[#0d2818] font-sans text-white">
      <Sidebar />
      <main className="min-h-full pl-64">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
