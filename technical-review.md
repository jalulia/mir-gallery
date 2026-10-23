# Mindgut documentation — Revision 10 technical review

23 October 2026. Scope: all eleven documentation pages, their calculations, native UI examples, responsive layouts, navigation and public publication. No live account mutation or model turn was performed.

## Evidence boundary

The installed app reports **2.2.64**. Its five readable interface files (`index.html`, `app.css`, `app.js`, `my-helix.html`, `my-wave.html`) match the recorded 2.2.59 files byte for byte. The original Mindgut logotype, head mark and icon come from that installed app. Hashes are recorded in `qa/version-verification.json`.

Backend explanations refer to source commit **cbf4e42**, dated 1 August 2026. Packaged Python was not decompiled. Current backend behaviour, provider routing, worker limits, sync retention and production automation remain unverified. Computable encoding and selection rules do not establish psychological or scientific interpretations of their values.

## Findings and corrections

| Topic | Finding | Correction and evidence |
|---|---|---|
| Turn completion | The diagram put persistent recording ahead of context trimming. | Show update → trim → attempt crystallization. Write failures are caught separately, so visible text, context and saved record can diverge. `server/session_manager.py:1386–1435`. |
| Composer | Sending an aside is not the same as its delivery. | Five-state interactive example: idle, working, ASIDE, HEARD and QUEUED. The queue takes precedence over automation. Installed `app.js` input and event handlers. |
| Context | A transcript can look longer than the context sent to the model. | Layered visual separates visible exchanges, retained exchanges, recall and successfully recorded history. Source 7 → 4 release demonstrated at exact boundaries. |
| Automation | A phrase alone does not initiate a continuation. | Local decision lab checks arm state, final done event, exact normalized trailing trigger, pending user message and reply budget. Installed `app.js:902–1100`. No messages are sent. |
| Model defaults | Older stored defaults can be migrated. | Explain first defaults and migration without promising every saved selection survives a version change. Installed `app.js:4601–4640` and defaults migration. |
| Unicode | “Only ASCII input counts” is too broad. | The source uppercases each character and then accepts a single A–Z character: dotless ı can count; ß expands to SS and is excluded. Word tokenization separately uses `[a-zA-Z]+`. `engine/scanner.py:40–138`. |
| Clause variation | A block’s letter balance is not windowed clause variance. | New σB lab uses the last seven nonempty clauses and the source’s four-decimal fractions, balance rounding and population variance. Fewer than two clauses return zero. `assembly/sigma_b.py:41–160`. Manual line boundaries are stated. |
| Strand types | A count or retained header does not guarantee retrievable conversation text. | Inspect exchange, computed-summary, file-event and empty-payload examples. File event payload is its filename; an event is not the artifact. `engine/crystallizer_v2.py` and `engine/doc_helix.py:127`. |
| File operations | Upload, folder mount, scan and recall enrollment are distinct. | Three-path interactive example with source-shaped panels and a synthetic downloadable record. `scan_and_mount` is a separate source tool. Scanner display is transient; its list loader is empty. |
| Delete and unmount | Different removal paths have different retention implications. | UI × confirms before DELETE. The separate `manage_display(remove)` tool preserves an archive copy; that does not prove UI-delete retention. Folder clear removes frontend handles and flags without its own backend-unmount route. Installed `app.js:3542–3550,3961–3973`; `server/tools.py:1945–2002`. |
| Draft finalization | Finalization is not deletion of the draft or quality approval. | Open/append/finalize example retains the draft while adding Output. Generic Markdown is downloadable. `server/tools.py:2790–2848`. |
| Recovery | A failed turn does not roll back completed writes. | Three scenarios distinguish provider failure, tool failure after a save and crystallizer failure after a visible answer. Each identifies what to preserve and inspect. |
| Developer setup | Old launch commands were presented more confidently than their evidence allowed. | Replace the unverified recipe with a revision/configuration/isolation checklist. Dependencies and launch steps were not reproduced. |
| Identity and motion | Screenshots could not adapt to the page or protect private content. | Native UI registry, synthetic data, original brand assets, and a fine-line canvas helix. Motion pauses out of view and when the document is hidden; reduced-motion preference starts still. |

## Chapter coverage

| Page | Review focus and illustration |
|---|---|
| Contents | Original identity; responsive, cleanly cropped helix; model, output and record UI. |
| Overview | Full workspace, record boundaries, corrected turn lifecycle. |
| Getting started | Model/effort, file use, display modes, five composer states, developer boundary. |
| Context | Source release cycle, context-layer visual, automatic and deliberate recall. |
| Sidebar | Eleven native panel specimens, actions versus readouts, Automator decision lab. |
| Memory | Letter/word encoder, clause variation, founding phase plot, source recall selection, strand inspector, 3D and wave viewers. |
| Files | Upload/mount/scan comparison, deletion semantics, draft lifecycle, task/tool/worker scope. |
| Recovery | Three failure paths and preservation checks. |
| Reference | Version hashes, source references, tested/unverified distinctions, revision history. |
| Open questions | Current backend uncertainties remain open; examples do not claim to answer them. |
| Glossary | Terminology checked against the revised explanations. |

## Reuse

`build.py` composes a self-contained HTML master. Editorial components live in `source/labs.*`, the hero in `source/hero.*`, and the product examples in `source/ui/`. The UI registry retains isolated styles and local handlers. Viewer modules and fonts are embedded for offline use. `add_review.py` was a one-time scaffold; the current source files are authoritative.

The coded examples demonstrate local states. They do not implement the product’s backend, connect to an account, listen to a microphone, or read local folders.

## Privacy and preservation

All published UI examples use invented conversations, tasks, filenames and values. Revision 09 sanitized 35 public files, including old documentation and personal-record gallery pages/data; those sanitized paths are retained. Original work is preserved locally and in Git history, as requested. This is not a history erasure.

## Validation

The public receipt is `qa/revision-10.json`. All 39 source-calculation fixtures and five recall fixtures pass. Eleven routes were checked at 1440, 1024, 390 and 320 pixels; the affected views were retested after a resize-loop correction. All eight new examples and the hero were rendered at desktop and phone sizes. Search, chapter navigation, Escape, local file states, deletion confirmation, animation pause/resume and reduced motion were checked. Example downloads contain valid text or CSV with matching displayed sizes. Detailed receipts in the local review package cover calculations, route and frame checks, interactions, version hashes and deployment hashes. Visual captures include desktop and phone layouts. The Python fixtures execute inspected function definitions only; they do not launch the application.
