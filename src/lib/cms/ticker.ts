import { createPublicClient as createClient } from "@/lib/supabase/public";

export async function getActiveTickerHeadline(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ticker_items")
    .select("headline")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.headline ?? null;
}
