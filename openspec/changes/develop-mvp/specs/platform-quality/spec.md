## Purpose

Defines cross-cutting quality bars for isolation, errors, locales, screen states, accessibility, analytics, and Beta operational gates so MVP is safe to pilot.

## ADDED Requirements

### Requirement: Project data isolation
Every read or mutation of a project-scoped entity MUST succeed only when the entity belongs to the current session user. Another author's resource MUST yield `FORBIDDEN` or `NOT_FOUND` in the requester's scope without leaking existence beyond that. Identifiers MUST be opaque.

#### Scenario: Foreign project id
- **WHEN** an authenticated author requests another author's project or node by id
- **THEN** the system does not return the resource payload and does not mutate it

### Requirement: Uniform error envelope
Mutating APIs and, where possible, server actions MUST return errors as `{ error: { code, message, details } }`. Messages MUST be in the UI locale and MUST NOT include stack traces or SQL. Known codes include `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `EMAIL_NOT_VERIFIED`, `EXPORT_FAILED`, `AI_KEY_MISSING`, `AI_PROVIDER_ERROR`, `PAYLOAD_TOO_LARGE`, and `RATE_LIMITED`.

#### Scenario: Validation error shape
- **WHEN** a create-project call omits title
- **THEN** the response uses `VALIDATION_ERROR` with a message and optional field details, without a stack trace

### Requirement: P0 screen states
Each P0 screen MUST support normal, empty, loading, error, and no-access/deleted states. The editor save indicator MUST distinguish saving, saved, saved on device, conflict, and retryable error.

#### Scenario: Dashboard empty
- **WHEN** an author has no projects
- **THEN** the dashboard shows an empty state with a way to create a project, not a generic crash

#### Scenario: Deleted scene
- **WHEN** an author opens a scene that was soft-deleted
- **THEN** a deleted/no-access state is shown instead of a blank editor

### Requirement: Internationalization
The UI MUST be available in `ru` and `en`. P0 flows MUST NOT show raw message keys.

#### Scenario: Locale switch
- **WHEN** an author uses the English locale on login and dashboard
- **THEN** visible copy is English and no untranslated keys appear on those flows

### Requirement: Accessibility and keyboard (Beta)
P0 screens MUST meet WCAG 2.1 AA by the Beta gate. Critical flows (sign-in, create project, open scene, save, export) MUST be completable with keyboard only.

#### Scenario: Create project by keyboard
- **WHEN** an author uses only the keyboard from dashboard to submit a new project title
- **THEN** the project is created without requiring a pointer

### Requirement: Analytics without manuscript text
Product analytics MAY record named events such as scene opened, created, text-changed (boolean/count only), autosave succeeded/failed, focus mode, context panel, AI started/accepted, version restored, and export. Events MUST NOT include manuscript body, prompts, or AI answers.

#### Scenario: Autosave event
- **WHEN** a scene autosave succeeds
- **THEN** an analytics event is recorded without scene plain text or document JSON

### Requirement: Reliability ops (Beta)
By Beta the system MUST have daily database backups, client and server error monitoring, and an alert on repeated scene autosave failures. Deploy rollback MUST NOT wipe user data. Opening a typical last project SHOULD meet p75 ≤ 2.5 s on staging; title search SHOULD meet ≤ 1 s on a typical project. These performance numbers MUST be measurable on a fixture of at least 20 scenes and 15k words.

#### Scenario: Backup exists
- **WHEN** the Beta release gate is evaluated
- **THEN** a documented daily backup of the database is in place

#### Scenario: Autosave failure visible to ops
- **WHEN** scene autosave fails repeatedly
- **THEN** monitoring records the failure without storing manuscript text

### Requirement: Privacy policy at Beta
Privacy policy MUST be published before Beta. AI consent is required before first AI use. Legal documents are a Beta gate, not an Alpha blocker.

#### Scenario: Policy linked before AI
- **WHEN** an author reaches AI for the first time
- **THEN** privacy policy and consent are available before a request is sent
