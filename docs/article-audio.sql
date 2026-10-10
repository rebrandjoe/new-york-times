-- Listen to this article: run once in the Supabase SQL editor.
-- Safe to re-run (IF NOT EXISTS).

create table if not exists public.article_audio (
  article_id uuid primary key references public.articles(id) on delete cascade,
  content_hash text not null,
  storage_path text,
  duration_seconds real,
  status text not null default 'pending'
    check (status in ('pending', 'ready', 'failed')),
  error text,
  generated_at timestamptz,
  updated_at timestamptz default now()
);

alter table public.article_audio enable row level security;

-- No direct client access; only service role / server routes.
-- Intentionally no policies for anon/authenticated: access via signed URLs only.

-- Private storage bucket for MP3 files
insert into storage.buckets (id, name, public)
values ('article-audio', 'article-audio', false)
on conflict (id) do update set public = false;

-- Do not add public SELECT policies on storage.objects for this bucket.
-- Signed URLs are created with the service role.

grant select, insert, update, delete on public.article_audio to service_role;
