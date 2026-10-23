# Mindgut library access and review inbox

The entry screen uses the existing Mindgut head, wordmark and Geist fonts. All 51 served HTML pages are AES-256-GCM encrypted using the shared password. PBKDF2-SHA256 uses 600,000 iterations. Successful entry retains a derived key for the current tab.

**Boundary:** this is a reading gate on a previously public GitHub Pages site. Public Git history and non-HTML assets remain accessible. This update preserves that history. Genuine source confidentiality requires private source and private hosting.

## Submitting an update

Every documentation page has the same short form: name, what it is, pasted text or an uploaded file, and Submit for review. Files are limited to 5 MB. The page, title and base revision are attached automatically. Names are self-reported; this is a shared-password library, not individual identity verification.

Typed text is retained as an encrypted device-local draft until a successful submission. Uploaded files are not stored in browser drafts. A success message appears only after the server confirms the record.

## Reviewing submissions

Project: **Mindgut**, in the separate **Mindgut Free** organization.

Open the project’s Table Editor and select `gallery_proposals`. Uploaded files are in the private `gallery-review` Storage bucket, organized by proposal UUID. Anonymous visitors cannot read submissions, review history or stored files.

Reviewers change `status` through `new`, `in_review`, `accepted` and `published`, or `declined`. Add explanations in `reviewer_note`. When publishing, set `published_revision` too. The original submitted fields cannot be overwritten; changes to review state and notes are appended to `gallery_review_history`.

Accepted wording is applied in a Git commit referring to the proposal UUID, then released with a new documentation revision. Submitting a proposal does not publish it automatically.

## Implementation

- `collaboration/config.js`: submission endpoint and current documentation revision; no service secrets.
- `supabase/functions/gallery-feedback/index.ts`: shared-key authentication, input checks, private uploads, submission persistence and retry handling. `verify_jwt=false` because the handler authenticates the library key itself.
- `supabase/migrations/202610230001_gallery_feedback.sql`: reviewed initial schema, explicit privileges, row-level security, immutable originals and review history. The schema was applied through the signed-in Supabase SQL Editor because the connector’s authorization did not cover the new Free organization.
- The project’s generated `public.rls_auto_enable()` helper is restricted to database owners: `REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated`. Both browser roles were verified unable to execute it.
- The Edge Function contains a SHA256 verifier, not the bearer credential. Supabase supplies its service-role key server-side. Never put that key in browser code.
- `tools/check-feedback.mjs`: authorization, validation, pasted text, upload and failed-insert cleanup checks; supply the library password on stdin.

## Updating protected pages

Run `node tools/protect.mjs decrypt REPO_DIR PRIVATE_DIR`, supplying the password on stdin. Edit decrypted HTML outside the repository, then use `encrypt PRIVATE_DIR REPO_DIR`. Never commit plaintext copies or passwords. The shared entry template is `tools/access-template.txt`. Updating only the visual entry shell does not require re-encrypting unchanged payloads.
