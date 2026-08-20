## 1. Shared foundations

- [x] 1.1 Add shared error codes and `{ error: { code, message, details } }` helper used by Server Actions and `/api/v1` routes
- [x] 1.2 Align Zod schemas in `@manuscript/shared` with ТЗ (incl. `baseVersion` on scene save, `parentId` on move, AI `{ projectId, level, contextEntityIds, message }`); remove Chapter and grammar/continue/ideas as normative
- [x] 1.3 Add Unicode word-count util in `@manuscript/shared` and unit tests
- [x] 1.4 Drizzle schema: `SceneMetadata`, `SceneParticipant`, `Character` optional fields, `CharacterRelationship`, `plotMethod` default `blank`; do not expose WritingGoal/DailyStat/UserApiKey in UI
- [x] 1.5 Enforce `requireSession` + `assertProjectOwner` / `getNodeWithAuth` on every project-scoped mutation; map foreign ids to `FORBIDDEN`/`NOT_FOUND`
- [x] 1.6 Add login rate limit (5 failures / 10 min / IP+email → `RATE_LIMITED`)
- [x] 1.7 Hide or unroute `/stats` from MVP navigation

## 2. Projects (Alpha remainder)

- [x] 2.1 `listProjects({ query, includeArchived })` with default `archivedAt` null and `updatedAt` desc
- [x] 2.2 Dashboard search, empty state, and include-archived toggle (ru/en)
- [x] 2.3 `duplicateProject` copying tree and knowledge without mutating source
- [x] 2.4 `getProjectOverview` (continue scene, counts, next steps; no fake % without volume goal)
- [x] 2.5 Overview UI: primary continue action and 1–3 next steps; empty-project onboarding hints
- [x] 2.6 Confirm delete/archive dialogs; rename already present — verify validation 1–200

## 3. Manuscript structure (Alpha remainder)

- [x] 3.1 `reorderNodes` and `moveNode` with same-parent and cycle checks; persist `position`
- [x] 3.2 Navigator drag-and-drop wired to reorder/move; revert + toast on failure
- [x] 3.3 Unassigned scenes (create/list scene with `parentId` null)
- [x] 3.4 Cascade soft-delete children; `restoreNode`; project trash UI with confirmation
- [x] 3.5 Idempotent repeat delete of already soft-deleted node
- [x] 3.6 `setSceneStatus` only on `type=scene`; navigator shows icon + label
- [x] 3.7 Title filter in navigator scoped to current project
- [x] 3.8 Unit tests for cycle rejection and cascade soft-delete

## 4. Scene editor (Alpha)

- [x] 4.1 Ink Studio shell: rail | navigator | sheet | inspector; compact hides inspector; `<900px` does not mount editor
- [x] 4.2 TipTap editor with paragraphs, bold/italic/strike, lists, undo/redo; shared document schema module
- [x] 4.3 `saveSceneContent` with `contentJson`, `plainText`, `baseVersion`; increment version; server word counts
- [x] 4.4 Debounce 2000 ms autosave, Ctrl/Cmd+S and blur flush, non-blocking input, status indicator (saving/saved/saved on device/conflict/error)
- [x] 4.5 IndexedDB buffer per `sceneId`; restore after reload/offline; flush on reconnect
- [x] 4.6 Conflict 409 UI: load from server vs keep mine (no silent overwrite)
- [x] 4.7 Live word/character count in the sheet
- [x] 4.8 Scene metadata fields and inspector tabs (scene / characters / world); link/unlink character without deleting text
- [x] 4.9 Focus mode and shortcuts (S, Shift+F, Alt+Up/Down, Escape)
- [x] 4.10 Editor empty/loading/error/deleted states

## 5. Knowledge base (Alpha)

- [ ] 5.1 Character CRUD actions + list/card UI; required `name`; optional description fields
- [ ] 5.2 Character ↔ scene links in card and inspector
- [ ] 5.3 World articles CRUD; location type; other types with title + description
- [ ] 5.4 Character relationships: types, symmetric flag, canonicalize pair, reject self-link, upsert on duplicate
- [ ] 5.5 Confirm delete character/article; unlink participants; never delete scene text
- [ ] 5.6 `searchByTitle` across nodes, characters, world; results grouped by type
- [ ] 5.7 Routes `/projects/[id]/characters`, `.../characters/[id]`, `.../world` with P0 screen states
- [ ] 5.8 Unit tests for relationship canonicalize and self-link rejection

## 6. Export DOCX/TXT (Alpha)

- [ ] 6.1 Export scope validation (project / part / scene ids); empty set → `VALIDATION_ERROR`, no file
- [ ] 6.2 TXT export: heading levels, blank line between scenes, tree `position` order
- [ ] 6.3 DOCX export with same headings and basic marks
- [ ] 6.4 `GET`/`POST /api/v1/export`; `EXPORT_FAILED` leaves data intact
- [ ] 6.5 Export dialog UI (format + scope) ru/en

## 7. Closed Alpha gate

- [ ] 7.1 Walkthrough: register → project → structure → scene → character + location → relationship → export DOCX/TXT
- [ ] 7.2 Offline 5 min / kill-tab: buffered scene text restored (TZ-REL-01)
- [ ] 7.3 Isolation check: cannot read or mutate another user's project
- [ ] 7.4 P0 screens have empty/loading/error/no-access states; ru and en without raw keys
- [ ] 7.5 Update `docs/technical/API.md`, `DATABASE.md`, OpenAPI for Alpha surface
- [ ] 7.6 Hide plot/AI/import/billing entry points from Alpha UI

## 8. Auth completion (Beta)

- [ ] 8.1 Email verification (24 h TTL, one active token, resend invalidates, banner, `EMAIL_NOT_VERIFIED` on AI/delete/full export/email change)
- [ ] 8.2 Password reset (1 h TTL, no enumeration, invalidate all sessions)
- [ ] 8.3 Profile: display name and avatar
- [ ] 8.4 Account deletion: confirm password or typed email; export-first; delete-without-export second confirm; failure leaves account usable
- [ ] 8.5 SMTP env wiring for transactional mail in staging

## 9. Versions, plot, notes, search (Beta)

- [ ] 9.1 `SceneVersion` snapshots on successful text-changing saves with JSON dedup; restore UI
- [ ] 9.2 Conflict merge/choice UX to Beta bar (explicit, no silent discard)
- [ ] 9.3 Plot method catalog JSON (`blank`, `three-act`, `heros-journey`, `beat-sheet`); changing method warns and does not delete scene text
- [ ] 9.4 Plot board CRUD + DnD; storylines optional
- [ ] 9.5 Timeline event list by story time; warning on order conflict, not hard-block
- [ ] 9.6 Notes with text/links; file upload MIME allow-list and quotas; `PAYLOAD_TOO_LARGE`
- [ ] 9.7 PostgreSQL FTS + GIN on scene/knowledge plain text; highlight; ≤1 s on fixture
- [ ] 9.8 Command palette Ctrl/Cmd+K (commands + entities)
- [ ] 9.9 Backlinks on character/location detail
- [ ] 9.10 Drizzle migration for Storyline, StoryBeat, TimelineEvent, Note, StoredFile, SceneVersion

## 10. Extended IO (Beta)

- [ ] 10.1 PDF and Markdown export
- [ ] 10.2 ZIP `manuscript-export` v1 (manifest, tree, scenes, characters, relationships, world)
- [ ] 10.3 Import preview + confirm transaction for TXT/MD/DOCX/paste with heading mapping
- [ ] 10.4 ZIP import into new or empty project with regenerated ids; cancel preview is a no-op
- [ ] 10.5 Size limits 10 MB / 50 MB ZIP; broken file errors do not mutate
- [ ] 10.6 `IMPORT_ENABLED` feature flag; disabled UI and endpoints
- [ ] 10.7 Measure sync export p75 on 200-scene fixture; add job queue only if over 10 s
- [ ] 10.8 Round-trip tests: ZIP export → import creates a copy, not a silent merge

## 11. AI assistant (Beta)

- [ ] 11.1 Implement `@manuscript/ai` OpenAI-compatible `stream`; platform key server-side only
- [ ] 11.2 Server context assembly for levels 0–3 from DB; reject 4–5; ignore client blobs as sole source
- [ ] 11.3 `POST /api/v1/ai/chat` and `/edit` SSE (`chunk`/`done`/`error`), 30 s timeout
- [ ] 11.4 UI: context list before send, sources after, diff accept / accept fragment / reject; never auto-apply; never mutate entities/status
- [ ] 11.5 Consent + privacy gate; do-not-store toggle; last 50 messages; cascade delete with project
- [ ] 11.6 Verified-email gate, daily quota 50, `AI_ENABLED` flag, `AI_KEY_MISSING` / `AI_PROVIDER_ERROR`
- [ ] 11.7 Ensure logs/analytics never include manuscript, prompts, or answers
- [ ] 11.8 Unit tests for context assembly and level rejection

## 12. Platform quality (Beta)

- [ ] 12.1 Analytics adapter with named events only (no-op until vendor chosen)
- [ ] 12.2 Keyboard-only critical flows; WCAG 2.1 AA pass on P0 screens
- [ ] 12.3 Privacy policy page + AI consent copy (legal text may be placeholder until DEC-007)
- [ ] 12.4 Daily DB backup procedure and error monitoring (incl. autosave-failure alert without text)
- [ ] 12.5 Staging env checklist: NFR fixture ≥20 scenes / 15k words; last-project p75 ≤ 2.5 s
- [ ] 12.6 CI: keep quality job green; add unit-test job for shared/lib tests added in this change
- [ ] 12.7 Usability session protocol for ≥5 authors and first-saved-scene path (product gate, not code)

## 13. Documentation sync

- [ ] 13.1 Update API.md, OpenAPI, DATABASE.md, ARCHITECTURE.md to match shipped Alpha/Beta
- [ ] 13.2 Update ROADMAP and MVP Scope Matrix statuses after each sprint slice
- [ ] 13.3 Remove leftover Chapter / grammar-continue-ideas / stats copy from user-facing docs
