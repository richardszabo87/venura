"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavLink = {
  label: string;
  href: string;
};

const INVESTOR_LINKS: NavLink[] = [
  { label: "Deal Analyzer", href: "/analyzer" },
  { label: "HOA Danger Score", href: "/hoa" },
  { label: "RentCheck", href: "/rent" },
  { label: "Market Pulse", href: "/markets" },
  { label: "Investor Quiz", href: "/quiz" },
];

const BUYER_LINKS: NavLink[] = [
  { label: "First-Time Buyer Guide", href: "/guide" },
  { label: "True Cost Calculator", href: "/cost" },
  { label: "Rent vs Buy Calculator", href: "/rvb" },
  { label: "Mortgage Comparison", href: "/mortgage" },
  { label: "Investor Quiz", href: "/quiz" },
];

type DropdownId = "investors" | "buyers";

export function LandingHeader() {
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<DropdownId | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  function closeAll() {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileSection(null);
  }

  function toggleDropdown(id: DropdownId) {
    setOpenDropdown((current) => (current === id ? null : id));
  }

  function toggleMobileSection(id: DropdownId) {
    setMobileSection((current) => (current === id ? null : id));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1B4332]/95 backdrop-blur-md">
      <div
        ref={navRef}
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8"
      >
        <Link
          href="/"
          className="inline-flex items-baseline gap-0.5"
          onClick={closeAll}
        >
          <span className="text-xl font-bold tracking-tight text-white">
            Venura
          </span>
          <span className="text-xl font-bold text-[#E8D5B7]">.</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <NavDropdown
            label="For Investors"
            id="investors"
            links={INVESTOR_LINKS}
            isOpen={openDropdown === "investors"}
            onToggle={() => toggleDropdown("investors")}
            onClose={closeAll}
          />
          <NavDropdown
            label="For Buyers"
            id="buyers"
            links={BUYER_LINKS}
            isOpen={openDropdown === "buyers"}
            onToggle={() => toggleDropdown("buyers")}
            onClose={closeAll}
          />
          <Link
            href="/widget"
            className="rounded-lg px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            For Agents
          </Link>
          <a
            href="#pricing"
            className="rounded-lg px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-[#E8D5B7] px-4 py-2 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
          >
            Get started
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white transition hover:bg-white/10 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((open) => !open);
              setMobileSection(null);
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#1B4332] md:hidden">
          <nav className="mx-auto max-w-6xl space-y-1 px-6 py-4">
            <MobileAccordion
              label="For Investors"
              links={INVESTOR_LINKS}
              isOpen={mobileSection === "investors"}
              onToggle={() => toggleMobileSection("investors")}
              onNavigate={closeAll}
            />
            <MobileAccordion
              label="For Buyers"
              links={BUYER_LINKS}
              isOpen={mobileSection === "buyers"}
              onToggle={() => toggleMobileSection("buyers")}
              onNavigate={closeAll}
            />
            <MobileLink href="/widget" onNavigate={closeAll}>
              For Agents
            </MobileLink>
            <MobileLink href="#pricing" onNavigate={closeAll}>
              Pricing
            </MobileLink>
            <div className="border-t border-white/10 pt-3">
              <Link
                href="/sign-in"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                onClick={closeAll}
              >
                Log in
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavDropdown({
  label,
  id,
  links,
  isOpen,
  onToggle,
  onClose,
}: {
  label: string;
  id: DropdownId;
  links: NavLink[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        id={`${id}-trigger`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 transition ${
          isOpen
            ? "bg-white/10 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        {label}
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-labelledby={`${id}-trigger`}
          className="absolute left-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-[#E8D5B7]/30 bg-white py-1.5 shadow-lg shadow-black/10"
        >
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm font-medium text-[#1B4332]/80 transition hover:bg-[#1B4332] hover:text-[#E8D5B7]"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileAccordion({
  label,
  links,
  isOpen,
  onToggle,
  onNavigate,
}: {
  label: string;
  links: NavLink[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-white"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {label}
        <ChevronIcon open={isOpen} className="text-[#E8D5B7]" />
      </button>
      {isOpen && (
        <div className="border-t border-white/10 bg-white py-1">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="block px-4 py-2.5 text-sm font-medium text-[#1B4332]/80 transition hover:bg-[#1B4332] hover:text-[#E8D5B7]"
              onClick={onNavigate}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}

function ChevronIcon({
  open,
  className = "text-white/60",
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""} ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
