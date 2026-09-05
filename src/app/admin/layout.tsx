import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOutAction } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-black text-offwhite">
      <div className="border-b border-charcoal">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <span className="font-serif text-lg font-extrabold tracking-tight">
              <span className="text-white">JOSEPH</span> <span className="text-accent">MMWA</span>
            </span>
            <span className="ml-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-muted">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="focus-ring text-gray-secondary-light hover:text-accent">
              View site
            </Link>
            <form action={signOutAction}>
              <button type="submit" className="focus-ring text-gray-secondary-light hover:text-accent">
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <AdminNav />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
