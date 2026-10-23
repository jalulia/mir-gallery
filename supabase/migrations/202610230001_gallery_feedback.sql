-- Review inbox; raw submissions are immutable and uploaded files stay private.
create table public.gallery_proposals (
 id uuid primary key,
 created_at timestamptz not null default now(),
 author text not null default '' check (char_length(author) <= 100),
 title text not null check (char_length(title) between 1 and 160),
 note text not null default '' check (char_length(note) <= 16000),
 page text not null,
 page_title text not null,
 page_url text not null,
 base_revision text not null,
 file_path text,
 file_name text,
 file_mime text,
 file_bytes integer check (file_bytes between 0 and 5242880),
 status text not null default 'new' check (status in ('new','in_review','accepted','declined','published')),
 published_revision text,
 reviewer_note text,
 constraint proposal_has_material check (char_length(btrim(note)) > 0 or file_path is not null),
 constraint publication_has_revision check (status <> 'published' or nullif(btrim(published_revision),'') is not null)
);
alter table public.gallery_proposals enable row level security;
revoke all on public.gallery_proposals from anon, authenticated;
grant select, insert, update, delete on public.gallery_proposals to service_role;
create index gallery_proposals_queue on public.gallery_proposals(status,created_at desc);
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
grant select, insert on public.gallery_review_history to service_role;
grant usage,select on sequence public.gallery_review_history_id_seq to service_role;
create index gallery_review_history_proposal on public.gallery_review_history(proposal_id,changed_at desc);
create function public.record_gallery_review() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
 insert into public.gallery_review_history(proposal_id,old_status,new_status,published_revision,reviewer_note)
 values(new.id,case when TG_OP = 'UPDATE' then old.status else null end,new.status,new.published_revision,new.reviewer_note);
 return new;
end; $$;
revoke all on function public.record_gallery_review() from public,anon,authenticated;
create trigger gallery_review_insert after insert on public.gallery_proposals for each row execute function public.record_gallery_review();
create trigger gallery_review_update after update of status,published_revision,reviewer_note on public.gallery_proposals for each row execute function public.record_gallery_review();
create function public.preserve_gallery_submission() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
 if row(new.id,new.created_at,new.author,new.title,new.note,new.page,new.page_title,new.page_url,new.base_revision,new.file_path,new.file_name,new.file_mime,new.file_bytes)
 is distinct from row(old.id,old.created_at,old.author,old.title,old.note,old.page,old.page_title,old.page_url,old.base_revision,old.file_path,old.file_name,old.file_mime,old.file_bytes) then
  raise exception 'Original submissions are immutable; add a reviewer note or submit a new proposal.';
 end if;
 return new;
end; $$;
revoke all on function public.preserve_gallery_submission() from public,anon,authenticated;
create trigger preserve_gallery_submission before update on public.gallery_proposals for each row execute function public.preserve_gallery_submission();
