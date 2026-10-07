/**
 * Custom Next.js image loader — returns the source URL unchanged.
 * Combined with `images.unoptimized: true` in next.config, this ensures
 * zero traffic hits Vercel Image Optimization (free tier: 5,000 transforms/month).
 * Images are served directly from Supabase Storage or /public.
 */
export default function imageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return src;
}
