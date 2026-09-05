import { requireAdmin } from "@/lib/cms/admin-guard";
import { listTickerItems } from "@/lib/actions/admin-ticker";
import { TickerManager } from "@/components/admin/TickerManager";

export default async function AdminTickerPage() {
  await requireAdmin();
  const items = await listTickerItems();

  return (
    <div>
      <h1 className="font-serif text-3xl font-extrabold text-white">Live Ticker</h1>
      <p className="mt-2 text-sm text-gray-muted">
        Only one item is shown at a time. Publishing an item automatically archives whichever item was published before it.
      </p>
      <div className="mt-6">
        <TickerManager items={items} />
      </div>
    </div>
  );
}
