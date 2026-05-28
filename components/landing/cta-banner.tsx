"use client";

import { FormEvent, useState } from "react";

export function CtaBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

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

        {submitted ? (
          <p className="mt-8 text-lg font-semibold text-[#E8D5B7]">
            You&apos;re on the list!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-[#E8D5B7]/50 focus:outline-none focus:ring-2 focus:ring-[#E8D5B7]/20"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
            >
              Get started free →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
