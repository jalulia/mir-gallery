# Library access and proposed edits

All current HTML pages are AES-256-GCM encrypted. PBKDF2-SHA256 uses 600,000 iterations. Successful entry retains a derived key in sessionStorage for this tab. The library footer can lock it again. No password is embedded in shipped code. Draft notes are encrypted in localStorage with the same key.

**Boundary:** this is a reading gate on a previously public GitHub Pages site. The repository history and non-HTML assets remain public. Existing public copies cannot be made confidential by this update. Use private source plus a server-side gate to enforce genuine access control. This change deliberately preserves existing Git history.

## Current experience

Each of the eleven documentation pages has a contribution form. Visitors choose feedback, a proposed update, or Mir’s proposed update; author is optional and is self-reported. Proposals retain the chapter, page URL, base revision, note, replacement text, UUID and timestamp. Until the shared inbox is connected, the interface explicitly offers encrypted local drafts and JSON downloads only. It never reports those drafts as submitted.

## Shared review library — ready to connect

1. Select the intended Supabase project and apply `supabase/migrations/202610230001_gallery_feedback.sql`.
2. Deploy `supabase/functions/gallery-feedback` with `verify_jwt=false`; its own shared-key authorization is mandatory.
3. The function contains only a SHA256 verifier for the library key, never the bearer key itself. Supabase supplies the service URL and service-role secrets. If the gallery password changes, regenerate the verifier with it or set `COLLABORATION_ACCESS_KEY_SHA256` in the project’s Edge Function secrets.
4. Set `endpoint` in `collaboration/config.js` to that Edge Function’s URL. The interface then enables “Send for review.”
5. Review `gallery_proposals` in Supabase Studio. Move records through `new`, `in_review`, `accepted`, `published` (or `declined`). On publication, set `published_revision`. `gallery_review_history` automatically retains each status change and review note. Anonymous clients cannot read or modify either table.

Original submissions should stay intact. Add review explanations in `reviewer_note`; publish accepted changes in a Git commit referencing the proposal UUID. Record the new documentation revision in `published_revision`. This joins the feedback library to the site’s existing Git version history without automatically publishing suggested wording.

## Other easy options

- JSON proposal files: works now, no account or backend; a reviewer imports or reads them and applies accepted edits.
- Supabase inbox: recommended for a shared, private queue with page/revision context and a review trail.
- GitHub Issues and pull requests: useful for technical collaborators, but requires GitHub accounts and would expose notes in this public repository. It is not enabled here.

## Updating protected pages

Use `node tools/protect.mjs decrypt REPO_DIR PRIVATE_DIR`, supplying the password through stdin. Edit the decrypted HTML outside the repository, then run the same tool with `encrypt PRIVATE_DIR REPO_DIR`. Never commit plaintext copies or passwords. The root guide receives the collaboration includes during encryption. Verify the source diff and password behavior before pushing.
