-- Run in Supabase SQL editor (or via CLI) before relying on article-level control.
-- Safe, additive; default auto preserves previous "show on all articles" behaviour via auto classifier.

alter table public.articles
  add column if not exists medical_disclaimer_mode text not null default 'auto';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'articles_medical_disclaimer_mode_check'
  ) then
    alter table public.articles
      add constraint articles_medical_disclaimer_mode_check
      check (medical_disclaimer_mode = any (array['auto'::text, 'show'::text, 'hide'::text]));
  end if;
end$$;

comment on column public.articles.medical_disclaimer_mode is
  'auto = relevance classifier; show = always; hide = never';
