"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarUsage } from "@/components/dashboard/sidebar-usage";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analyzer", label: "Analyzer" },
  { href: "/saved-deals", label: "Saved Deals" },
  { href: "/compare", label: "Compare Deals" },
  { href: "/projections", label: "Projections" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/deal-alerts", label: "Deal Alerts" },
  { href: "/venura-ai", label: "VenuraAI" },
  { href: "/pricing", label: "Pricing" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();

  const displayName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses[0]?.emailAddress;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#1B4332]">
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/analyzer" className="group inline-flex items-baseline gap-0.5">
          <span className="text-2xl font-bold tracking-tight text-white">
            Venura
          </span>
          <span className="text-2xl font-bold text-[#E8D5B7]">.</span>
        </Link>
        <p className="mt-1 text-xs text-white/50">Investment Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#E8D5B7]/20 text-[#E8D5B7]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <SidebarUsage />
        {isLoaded && displayName && (
          <p className="mb-3 truncate text-sm font-medium text-white/80">
            {displayName}
          </p>
        )}
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="w-full rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300/90 transition hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-200"
          >
            Log out
          </button>
        </SignOutButton>
        <p className="mt-4 text-xs text-white/40">
          For illustrative purposes only
        </p>
      </div>
    </aside>
  );
}
