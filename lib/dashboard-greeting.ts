export function getTimeOfDayGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatGreeting(firstName: string | null | undefined): string {
  const name = firstName?.trim() || "there";
  return `${getTimeOfDayGreeting()} ${name}`;
}
