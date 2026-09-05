import Link from "next/link";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { getDashboardCounts, getRecentArticles } from "@/lib/cms/admin-queries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [counts, recent] = await Promise.all([
    getDashboardCounts(supabase),
    getRecentArticles(supabase, 8),
  ]);

  const stats = [
    { label: "Published", value: counts.published },
    { label: "Drafts", value: counts.drafts },
    { label: "Scheduled", value: counts.scheduled },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-extrabold text-white">Dashboard</h1>
        <Link
          href="/admin/articles/new"
          className="focus-ring bg-accent px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          New Article
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-charcoal bg-charcoal-deep p-6">
            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between border-b border-charcoal pb-3">
          <h2 className="font-serif text-xl font-bold text-white">Recently edited</h2>
          <Link href="/admin/articles" className="focus-ring text-sm font-semibold text-accent hover:underline">
            View all articles
          </Link>
        </div>
        <div className="divide-y divide-charcoal">
          {recent.length === 0 ? (
            <p className="py-6 text-sm text-gray-muted">No articles yet.</p>
          ) : (
            recent.map((article) => (
              <Link
                key={article.id}
                href={`/admin/articles/${article.id}`}
                className="focus-ring flex items-center justify-between gap-4 py-4 hover:bg-charcoal-deep"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{article.title}</p>
                  <p className="mt-1 text-xs text-gray-muted">
                    {article.category.name} · Updated {formatDate(article.updatedAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    article.status === "published"
                      ? "border-accent text-accent"
                      : "border-charcoal text-gray-muted"
                  }`}
                >
                  {article.status}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
