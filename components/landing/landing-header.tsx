import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1B4332]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="inline-flex items-baseline gap-0.5">
          <span className="text-xl font-bold tracking-tight text-white">
            Venura
          </span>
          <span className="text-xl font-bold text-[#74C69D]">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/analyzer"
            className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline"
          >
            Log in
          </Link>
          <Link
            href="/analyzer"
            className="rounded-lg bg-[#74C69D] px-4 py-2 text-sm font-semibold text-[#1B4332] transition hover:bg-[#95D5B2]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
