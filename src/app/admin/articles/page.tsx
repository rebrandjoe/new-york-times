import Link from "next/link";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { getAdminArticles, type AdminArticleFilters } from "@/lib/cms/admin-queries";
import { getCategories } from "@/lib/cms/queries";
import { ArticleRowActions } from "@/components/admin/ArticleRowActions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUSES: { value: AdminArticleFilters["status"]; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "unpublished", label: "Unpublished" },
];

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const categories = await getCategories();

  const articles = await getAdminArticles(supabase, {
    status: (params.status as AdminArticleFilters["status"]) || undefined,
    categoryId: params.category || undefined,
    search: params.search || undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-extrabold text-white">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="focus-ring bg-accent px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          New Article
        </Link>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="search"
          defaultValue={params.search}
          placeholder="Search by title…"
          className="focus-ring border border-white/10 bg-charcoal-deep px-4 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="focus-ring border border-white/10 bg-charcoal-deep px-4 py-2 text-sm text-offwhite focus:border-accent"
        >
          {STATUSES.map((s) => (
            <option key={s.label} value={s.value ?? ""}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="focus-ring border border-white/10 bg-charcoal-deep px-4 py-2 text-sm text-offwhite focus:border-accent"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="focus-ring border border-charcoal px-4 py-2 text-sm font-semibold text-offwhite hover:border-accent hover:text-accent"
        >
          Filter
        </button>
      </form>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal text-xs uppercase tracking-wide text-gray-muted">
              <th className="py-3 pr-4 font-semibold">Title</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Category</th>
              <th className="py-3 pr-4 font-semibold">Published</th>
              <th className="py-3 pr-4 font-semibold">Updated</th>
              <th className="py-3 pr-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-muted">
                  No articles match these filters.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="max-w-xs truncate py-3 pr-4 font-medium text-white">
                    <Link href={`/admin/articles/${article.id}`} className="focus-ring hover:text-accent">
                      {article.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        article.status === "published"
                          ? "border-accent text-accent"
                          : "border-charcoal text-gray-muted"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-secondary-light">{article.category.name}</td>
                  <td className="py-3 pr-4 text-gray-secondary-light">{formatDate(article.publicationDate)}</td>
                  <td className="py-3 pr-4 text-gray-secondary-light">{formatDate(article.updatedAt)}</td>
                  <td className="py-3 pr-4">
                    <ArticleRowActions articleId={article.id} status={article.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
