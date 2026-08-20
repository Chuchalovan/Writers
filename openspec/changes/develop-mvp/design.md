## Context

See `proposal.md` for motivation. Product SoT remains [MVP Scope Matrix](../../docs/roadmap/MVP-SCOPE-MATRIX.md), behavior [PRD](../../docs/prd/PRD.md) / [Use Cases](../../docs/user-stories/use-cases.md), contracts [ТЗ](../../docs/tz/TZ.md).

**Fact today:** pnpm monorepo, Next.js 15 App Router, Drizzle + PostgreSQL 16, Better Auth email/password, next-intl ru/en, CI quality job. Implemented: landing, login/register, project CRUD (no duplicate/search/overview), manuscript node create/update/soft-delete without reorder/move/restore cascade, scene route stub. Missing: TipTap autosave, knowledge modules, export/import, AI routes, unified error envelope, Ink Studio shell.

Constraints: DEC-001 Accepted (this stack). DEC-002/003 Proposed — treat TipTap + ProseMirror JSON as the document. DEC-005 Proposed — platform AI for Beta, BYOK P2. DEC-012 — do not implement WritingGoal/DailyStat. UI SoT: Figma Ink Studio.

## Goals / Non-Goals

**Goals:**

- Close the gap from current code to Alpha then Beta using existing packages (`apps/web`, `@manuscript/shared`, `@manuscript/ai`) rather than a new service.
- Align Drizzle schema with ТЗ §6.5 tables for P0/P1; keep P2 tables unused in UI.
- One ownership check + Zod boundary on every mutation; REST only for SSE and file download.
- Ship in sprint order (2 remainder → 3 → 4 P0 → 6 export → 4 P1 / 5 AI / 6 polish) so Alpha is demoable before Beta features.

**Non-Goals:**

- Rewriting auth away from Better Auth, splitting a separate API server, or introducing real-time collab.
- Making `DailyStat` / `WritingGoal` / `UserApiKey` product-facing.
- Perfect visual token sync with Figma (DEC-011) as a code blocker for Alpha — match layout zones and states first.
- Choosing production host in this design; local + CI remain the Alpha runtime.

## Decisions

### 1. Transport: Server Actions for CRUD, Route Handlers for stream/files

**Choice:** Keep Server Actions + Zod from `@manuscript/shared` for all CRUD. Use `POST /api/v1/ai/chat|edit` (SSE) and `GET/POST /api/v1/export` for bytes and streams.

**Why:** Matches ТЗ §6.1, avoids duplicating session/CSRF for every form mutation, and keeps AI timeout/streaming off the Action response model.

**Alternatives:** tRPC or a pure REST resource API — more ceremony, no gain for a single Next app.

### 2. Error envelope and auth helpers

**Choice:** Normalize Action/REST errors to `{ error: { code, message, details } }` with i18n messages. Centralize `requireSession`, `assertProjectOwner`, `getNodeWithAuth`. Map not-found in scope to `NOT_FOUND`, cross-user to `FORBIDDEN`.

**Why:** Specs require a stable contract; current `throw new Error` / `{ error: "invalid_title" }` cannot be tested uniformly.

**Alternatives:** Problem+JSON RFC 7807 — compatible in spirit but would diverge from already published ТЗ/OpenAPI.

### 3. Data model: migrate toward ТЗ §6.5, leave P2 dormant

**Choice:** Add/complete `SceneMetadata`, `SceneParticipant`, `CharacterRelationship`, `SceneVersion` (Beta), `Storyline`/`StoryBeat`, `TimelineEvent`, `Note`, `StoredFile`, `AIConversation`/`AIMessage`. Extend `Character` optional fields. Keep `UserApiKey`, `DailyStat`, `WritingGoal` in schema if already present but unused by UI. Catalog of plot methods lives in `@manuscript/shared` JSON, not a DB table; `Project.plotMethod` stores the id.

**Why:** Specs need those entities; Drizzle schema is the SoT for implementation. Forward-only migrations on release gates.

**Alternatives:** JSON blobs on `Project` for knowledge — cheaper now, blocks search, relationships, and ZIP export.

### 4. Editor document and save pipeline

**Choice:** TipTap 2.x; `contentJson` = constrained ProseMirror doc (marks/nodes from ТЗ §6.5.14). Client computes `plainText`; server computes `wordCount` and `Project.totalWordCount` on successful save. Flow: debounce 2s → IndexedDB keyed by `sceneId` → `saveSceneContent({ sceneId, contentJson, plainText, baseVersion })`. Conflict = version mismatch → 409; Alpha UI: load server vs keep mine; Beta: `SceneVersion` snapshots + restore.

**Why:** DEC-002/003 plus observable autosave/offline requirements. IndexedDB survives tab kill better than `sessionStorage`.

**Alternatives:** Lexical — extra spike; `localStorage` — quota and sync issues; OT/CRDT — collab P2.

### 5. Shell layout

**Choice:** Replace wide text sidebar with Ink Studio zones: 64px rail | 260px navigator | sheet | 320px inspector. Compact hides inspector; `<900px` does not mount the editor.

**Why:** Specs for layout and mobile read-only. Incremental CSS token alignment can follow DEC-011.

### 6. Knowledge uniqueness and graph

**Choice:** Canonicalize character pair `(min(id), max(id), type)` for uniqueness; `symmetric` flag drives dual-card display. No graph visualization library in MVP.

**Why:** Spec forbids self-links and duplicate rows; a graph UI is P2.

### 7. Search

**Choice:** Title search = SQL `ILIKE` / `startsWith` on node, character, world titles in `projectId`. Full-text (Beta) = PostgreSQL `tsvector` on `SceneContent.plainText` and selected knowledge fields, GIN index, highlight via `ts_headline`.

**Why:** Stays in Postgres; typical-project ≤1 s is realistic with indexes. External search (Meilisearch/Typesense) is extra ops for Beta.

### 8. Export / import

**Choice:** Synchronous DOCX/TXT (and later PDF/MD/ZIP) while p75 ≤ 10 s on ≤200 scenes; if not, introduce a job queue (BullMQ) as P1 hardening — not on the Alpha path. DOCX via a maintained HTML/DOCX library from sanitized editor HTML; TXT from `plainText` + heading prefixes. ZIP = exact `manuscript-export` v1 layout. Import parses on server, returns a preview DTO, commits in one transaction on confirm.

**Why:** Spec forbids silent merge and requires preview; Alpha must not wait on queue infra.

### 9. AI

**Choice:** Implement `packages/ai` `stream` against one platform provider (OpenAI-compatible). Server loads entities by `level` + `contextEntityIds`. Feature flag `AI_ENABLED`. Quota counter per user per UTC day in DB or Redis later; start with a Drizzle counter table or reuse a small `AiUsage` model (not BYOK). Consent stored on user. Unverified email short-circuits before provider.

**Why:** DEC-005 platform default; specs forbid client-trusted blobs and auto-apply.

**Alternatives:** BYOK first — P2. Client-side keys — leak risk.

### 10. Email, rate limit, flags

**Choice:** Better Auth email verification + password reset with SMTP env (Beta). Login rate limit: in-memory or DB-backed counter per IP+email for Alpha single-instance; Redis when horizontally scaled. Flags: `AI_ENABLED`, `IMPORT_ENABLED` env (and optional edge config later).

### 11. Tests and DoD

**Choice:** Add unit tests for shared word-count, tree move/cycle, relationship canonicalize, ZIP manifest, AI context assembly. Component/e2e for Alpha happy path can land in Sprint 6; CI remains typecheck/lint/build until a test job is added, then that job becomes required.

## Risks / Trade-offs

- [Scope creep into Scrivener] → Ship Alpha gate before plot/AI; matrix P2 stays out of tasks.
- [Text loss / distrust] → IndexedDB + version + explicit conflict; never overwrite on 409.
- [TipTap schema drift vs export/import] → One shared schema module; export/import round-trip tests on fixtures.
- [FTS quality in Russian] → Accept Postgres FTS for Beta; stemming may be imperfect — title search remains P0 fallback.
- [AI cost/abuse] → Daily quota, verified email, flag, 30s timeout, no Level 4–5.
- [Sync export timeout on large books] → Measure at 200 scenes; add jobs only if p75 misses 10 s.
- [DEC still Proposed] → Code to ТЗ draft (TipTap, platform AI, mobile read-only, method ids); Product copy for beats can land without schema change.
- [Wide sidebar vs Figma] → Layout rework is on the editor sprint critical path; visual polish can trail.

## Migration Plan

1. Drizzle migrations additive (new tables/columns, indexes). Do not rename Better Auth tables.
2. Backfill: `SceneContent.plainText` / `wordCount` from existing JSON if any; `plotMethod = blank`.
3. Deploy app then migrate (expand) — new columns optional or defaulted. Rollback = previous app revision; do not down-migrate data on gate.
4. Feature-flag AI and import off until Beta staging checks pass.
5. After each module: update `docs/technical/API.md`, `DATABASE.md`, OpenAPI if HTTP changed.

## Open Questions

- Exact beat titles/copy for `three-act` / `heros-journey` / `beat-sheet` (DEC-009) — ids are fixed; copy can ship as JSON content in Sprint 4.
- Analytics vendor (events already named) — can be a no-op adapter until Beta.
- Staging/production host and backup tool — ops checklist for Beta, not Alpha architecture.
- Figma variable publish (DEC-011) — visual, does not change capability specs.
- Legal entity / privacy text (DEC-007) — Beta gate content, not runtime design.
