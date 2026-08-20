## Purpose

Lets authors ask a context-aware assistant for suggestions that never change the manuscript until the author explicitly accepts them.

## ADDED Requirements

### Requirement: Context levels 0–3
The system SHALL run AI chat only with an explicit context level 0–3 and a list of entity ids. Before send, the UI MUST show the entities that will be used. The server MUST rebuild entity text from stored project data and MUST NOT trust client-supplied full-project blobs as the sole context. Levels 4–5 (whole project / all chapters) MUST be rejected in MVP. Request body MUST include `projectId`, `level`, `contextEntityIds`, and `message`.

#### Scenario: Visible context before send
- **WHEN** an author selects level 2 and starts chat
- **THEN** the UI lists the current scene (and its metadata) as context before the request is sent

#### Scenario: Level 4 rejected
- **WHEN** a client requests level 4 or 5
- **THEN** the system rejects the request and does not call the provider

### Requirement: Streaming chat and edit
The system SHALL stream chat and selection-edit responses. Timeout MUST be 30 seconds. Provider failure MUST surface `AI_PROVIDER_ERROR` in the AI panel and MUST leave the editor fully usable. Missing platform key or quota MUST return `AI_KEY_MISSING` or an equivalent quota error without changing scene content.

#### Scenario: Chat stream
- **WHEN** an author sends a chat message with valid context
- **THEN** the panel receives incremental chunks and a done signal

#### Scenario: Provider failure
- **WHEN** the provider errors or times out
- **THEN** the author sees an error in the AI panel and the scene text is unchanged

### Requirement: Accept, accept fragment, or reject
The system SHALL treat AI output as a suggestion. Scene text MUST change only after the author accepts the whole suggestion or an accepted fragment. Reject MUST discard the suggestion without mutating the scene. AI MUST NOT create or delete project entities and MUST NOT change scene status.

#### Scenario: Reject keeps text
- **WHEN** an author rejects an edit suggestion
- **THEN** the scene document is identical to the pre-suggestion version

#### Scenario: Accept fragment
- **WHEN** an author accepts only a selected portion of a suggestion
- **THEN** only that portion is applied to the scene and the rest is not inserted

### Requirement: Source transparency
The system SHALL show which in-project entities the answer was based on after a response.

#### Scenario: Sources listed
- **WHEN** a chat response completes for level 3
- **THEN** the UI lists the characters, location, or plot entities used

### Requirement: Consent and privacy
The system SHALL show privacy policy and AI consent before the first AI request. Manuscript text MUST NOT be used to train a model without explicit consent. Application logs and product analytics MUST NOT contain manuscript body, prompts, or model answers. Chat history MUST retain at most the last 50 messages unless the author disables storage; deleting a project MUST delete its AI conversations.

#### Scenario: Consent gate
- **WHEN** an author who has not consented opens AI
- **THEN** the first request is blocked until consent is recorded

#### Scenario: Do not store toggle
- **WHEN** the author disables storing AI history
- **THEN** subsequent messages are not persisted as conversation history

### Requirement: Email verification and quota
AI MUST require a verified email. Unverified authors MUST receive `EMAIL_NOT_VERIFIED`. Platform quota MUST default to 50 requests per user per day until tariffs exist; exceeding it MUST show a clear error. AI MUST be disableable by feature flag without a code deploy.

#### Scenario: Quota exceeded
- **WHEN** an author exceeds the daily platform quota
- **THEN** the next request is refused with a clear error and the editor remains usable

#### Scenario: Flag off
- **WHEN** the AI feature flag is off
- **THEN** AI endpoints refuse the operation and the writing UI remains available
