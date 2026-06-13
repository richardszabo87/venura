"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarUsage } from "@/components/dashboard/sidebar-usage";

type NavItem = {
  href: string;
  label: string;
  icon?: "gear";
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analyzer", label: "Analyzer" },
  { href: "/listings", label: "Listings" },
  { href: "/saved-deals", label: "Saved Deals" },
  { href: "/compare", label: "Compare Deals" },
  { href: "/projections", label: "Projections" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/deal-alerts", label: "Deal Alerts" },
  { href: "/venura-ai", label: "VenuraAI" },
  { href: "/pricing", label: "Pricing" },
  { href: "/settings", label: "Settings", icon: "gear" },
];

function GearIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 opacity-70"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

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
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#E8D5B7]/20 text-[#E8D5B7]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon === "gear" ? <GearIcon /> : null}
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
          Venura · Real estate intelligence
        </p>
      </div>
    </aside>
  );
}
