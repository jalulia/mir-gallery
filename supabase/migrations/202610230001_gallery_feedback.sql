-- Apply to the selected Supabase project before deploying the Edge Function.
create table public.gallery_proposals (
 id uuid primary key,
 created_at timestamptz not null default now(),
 kind text not null check (kind in ('feedback','proposal','mir-proposal')),
 author text not null default '' check (char_length(author) <= 100),
 note text not null check (char_length(note) between 1 and 12000),
 replacement text not null default '' check (char_length(replacement) <= 16000),
 page text not null,
 page_title text not null,
 page_url text not null,
 base_revision text not null,
 status text not null default 'new' check (status in ('new','in_review','accepted','declined','published')),
 published_revision text,
 reviewer_note text
);
alter table public.gallery_proposals enable row level security;
revoke all on public.gallery_proposals from anon, authenticated;
-- No browser read/write policies: only the authenticated Edge Function writes.
create table public.gallery_review_history (
 id bigint generated always as identity primary key,
 proposal_id uuid not null references public.gallery_proposals(id),
 changed_at timestamptz not null default now(),
 old_status text,
 new_status text not null,
 published_revision text,
 reviewer_note text
);
alter table public.gallery_review_history enable row level security;
revoke all on public.gallery_review_history from anon, authenticated;
create function public.record_gallery_review() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.gallery_review_history(proposal_id,old_status,new_status,published_revision,reviewer_note)
 values(new.id,case when TG_OP = 'UPDATE' then old.status else null end,new.status,new.published_revision,new.reviewer_note);
 return new;
end; $$;
create trigger gallery_review_insert after insert on public.gallery_proposals for each row execute function public.record_gallery_review();
create trigger gallery_review_update after update of status, published_revision, reviewer_note on public.gallery_proposals for each row execute function public.record_gallery_review();
