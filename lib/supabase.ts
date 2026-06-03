import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

const PLACEHOLDER_URLS = new Set([
  "https://your-project.supabase.co",
  "http://your-project.supabase.co",
  "your-project.supabase.co",
]);

const PLACEHOLDER_KEYS = new Set(["your-anon-key", "your_anon_key"]);

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function resolveSupabaseUrl(): string | undefined {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_URL") ?? readEnv("SUPABASE_URL")
  );
}

function resolveSupabaseAnonKey(): string | undefined {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readEnv("SUPABASE_ANON_KEY")
  );
}

function normalizeSupabaseUrl(raw: string): string {
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  // Common copy-paste from the dashboard: "abcdefgh.supabase.co" without a scheme.
  if (/^[a-z0-9-]+\.supabase\.co\/?$/i.test(raw)) {
    return `https://${raw.replace(/\/$/, "")}`;
  }

  return raw;
}

function assertValidSupabaseUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL "${url}". Use your project URL from Supabase (Settings → API), including https:// — for example https://abcdefgh.supabase.co`,
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL "${url}". The URL must start with http:// or https://.`,
    );
  }
}

export function getSupabaseConfigError(): string | null {
  try {
    resolveSupabaseConfig();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid Supabase configuration";
  }
}

function resolveSupabaseConfig(): { url: string; anonKey: string } {
  const rawUrl = resolveSupabaseUrl();
  const anonKey = resolveSupabaseAnonKey();

  if (!rawUrl && !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.example). Restart the dev server after updating env vars.",
    );
  }

  if (!rawUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Add your Supabase project URL to .env.local (Settings → API in the Supabase dashboard), then restart the dev server.",
    );
  }

  if (!anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add your Supabase anon public key to .env.local (Settings → API), then restart the dev server.",
    );
  }

  const url = normalizeSupabaseUrl(rawUrl);
  assertValidSupabaseUrl(url);

  if (PLACEHOLDER_URLS.has(rawUrl) || PLACEHOLDER_URLS.has(url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is still set to the .env.example placeholder. Replace it with your real project URL from the Supabase dashboard.",
    );
  }

  if (PLACEHOLDER_KEYS.has(anonKey)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is still set to the .env.example placeholder. Replace it with your project's anon public key from the Supabase dashboard.",
    );
  }

  return { url, anonKey };
}

export function getSupabase(): SupabaseClient {
  if (supabase) return supabase;

  const { url, anonKey } = resolveSupabaseConfig();

  try {
    supabase = createClient(url, anonKey);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    throw new Error(
      `Failed to initialize Supabase client: ${detail}. Check NEXT_PUBLIC_SUPABASE_URL in .env.local (must be a valid https://…supabase.co URL).`,
    );
  }

  return supabase;
}
