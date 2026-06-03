/**
 * Verifies Supabase env vars and that public.saved_deals is reachable via service role.
 * Usage: node scripts/check-supabase.mjs
 * Loads .env.local when present (same as Next.js dev).
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env.local");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function readEnv(name) {
  const value = process.env[name];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeUrl(raw) {
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^[a-z0-9-]+\.supabase\.co\/?$/i.test(raw)) {
    return `https://${raw.replace(/\/$/, "")}`;
  }
  return raw;
}

const rawUrl =
  readEnv("NEXT_PUBLIC_SUPABASE_URL") ?? readEnv("SUPABASE_URL");
const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

if (!rawUrl || !serviceRoleKey) {
  console.error(
    "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local",
  );
  process.exit(1);
}

const url = normalizeUrl(rawUrl);
let parsed;
try {
  parsed = new URL(url);
} catch {
  console.error(`Invalid NEXT_PUBLIC_SUPABASE_URL: "${rawUrl}"`);
  process.exit(1);
}

if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
  console.error(`URL must use http or https, got: ${parsed.protocol}`);
  process.exit(1);
}

const client = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error, count } = await client
  .from("saved_deals")
  .select("id", { count: "exact", head: true });

if (error) {
  console.error("saved_deals query failed:", error.message);
  if (error.code === "42P01") {
    console.error(
      "Table missing. Run supabase/migrations/001_saved_deals.sql in the Supabase SQL editor.",
    );
  }
  process.exit(1);
}

console.log(
  `OK: service role connected to ${parsed.host}, saved_deals exists (row count: ${count ?? 0})`,
);
