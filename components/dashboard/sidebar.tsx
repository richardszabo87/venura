"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-[#1B4332]">
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/analyzer" className="group inline-flex items-baseline gap-0.5">
          <span className="text-2xl font-bold tracking-tight text-white">
            Venura
          </span>
          <span className="text-2xl font-bold text-[#74C69D]">.</span>
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
                      ? "bg-[#74C69D]/20 text-[#74C69D]"
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
        <p className="text-xs text-white/40">
          For illustrative purposes only
        </p>
      </div>
    </aside>
  );
}
