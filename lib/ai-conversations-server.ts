import { getSupabaseAdmin } from "./supabase";

export type AiConversationRow = {
  id: string;
  clerk_user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

const HISTORY_LIMIT = 10;

export async function fetchRecentConversations(
  clerkUserId: string,
  limit = HISTORY_LIMIT,
): Promise<AiConversationRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as AiConversationRow[]).reverse();
}

export async function saveConversationMessages(
  clerkUserId: string,
  messages: { role: "user" | "assistant"; content: string }[],
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const rows = messages.map((message) => ({
    clerk_user_id: clerkUserId,
    role: message.role,
    content: message.content,
  }));

  const { error } = await supabase.from("ai_conversations").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}
