import type { PropertyInputs } from "./calculator";

const STORAGE_KEY = "venura:lastAnalysis";

export function saveLastAnalysis(inputs: PropertyInputs): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
}

export function getLastAnalysis(): PropertyInputs | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PropertyInputs;
  } catch {
    return null;
  }
}
