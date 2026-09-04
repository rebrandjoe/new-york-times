# JOSEPH MMWA

Homepage for **JOSEPH MMWA** — "If it's health, it's here."

Built with Next.js (App Router) + TypeScript + Tailwind CSS v4. Deploys to Vercel.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app` — routes (file-based). Every nav/footer destination has a real route; pages
  without content yet use the shared `PlaceholderPage` component.
- `src/components` — header, hero, homepage sections, footer, and shared UI.
- `src/lib/types.ts` — data interfaces (`Article`, `Category`, `Topic`, `Region`,
  `Author`, `Image`, publication metadata) that a future Supabase-backed CMS can fill.
- `src/lib/mock-data.ts` — placeholder content only. No real editorial copy.

## Status

This pass covers homepage design, layout, navigation, and routing only. CMS,
authentication, subscriptions, payments, and the newsletter backend are not built yet —
see the data interfaces in `src/lib/types.ts` for how Supabase will plug in later.
