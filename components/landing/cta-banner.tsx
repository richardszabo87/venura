import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="border-t border-white/10 bg-[#1B4332] py-16">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to analyze your first deal?
        </h2>
        <p className="mt-4 text-white/60">
          Join investors using Venura to make faster, clearer rental
          decisions.
        </p>

        <Link
          href="/sign-up"
          className="mt-8 inline-flex rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
        >
          Get started free →
        </Link>
      </div>
    </section>
  );
}
