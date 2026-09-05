"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/cms/admin-guard";
import type { TickerFormState } from "./form-state";

export interface TickerItemRow {
  id: string;
  headline: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  publishedAt: string | null;
}

export async function listTickerItems(): Promise<TickerItemRow[]> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("ticker_items")
    .select("id, headline, status, created_at, published_at")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    headline: row.headline,
    status: row.status as TickerItemRow["status"],
    createdAt: row.created_at,
    publishedAt: row.published_at,
  }));
}

export async function createTickerItem(
  _prevState: TickerFormState,
  formData: FormData
): Promise<TickerFormState> {
  const { supabase } = await requireAdmin();
  const headline = String(formData.get("headline") ?? "").trim();

  if (!headline) {
    return { status: "error", message: "Please enter the ticker text." };
  }

  const { error } = await supabase.from("ticker_items").insert({ headline, status: "draft" });
  if (error) return { status: "error", message: "Could not create the ticker item." };

  revalidatePath("/admin/ticker");
  return { status: "success", message: "Ticker item created as a draft." };
}

async function setTickerStatus(id: string, status: "draft" | "published" | "archived") {
  const { supabase } = await requireAdmin();

  if (status === "published") {
    // Only one item is shown at a time — publishing one archives the rest.
    await supabase
      .from("ticker_items")
      .update({ status: "archived" })
      .eq("status", "published");
  }

  await supabase
    .from("ticker_items")
    .update({ status, published_at: status === "published" ? new Date().toISOString() : null })
    .eq("id", id);

  revalidatePath("/admin/ticker");
  revalidatePath("/");
}

export async function publishTickerItem(id: string) {
  await setTickerStatus(id, "published");
}

export async function archiveTickerItem(id: string) {
  await setTickerStatus(id, "archived");
}

export async function deleteTickerItem(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("ticker_items").delete().eq("id", id);
  revalidatePath("/admin/ticker");
  revalidatePath("/");
}
