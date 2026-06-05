"use client";

import { useUser } from "@clerk/nextjs";
import { formatGreeting } from "@/lib/dashboard-greeting";

export function DashboardGreeting() {
  const { user } = useUser();

  return formatGreeting(user?.firstName);
}
