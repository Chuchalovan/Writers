## Purpose

Lets authors write scene prose in a calm desktop layout with autosave, a local offline buffer, scene context, and recoverable version conflicts.

## ADDED Requirements

### Requirement: Rich-text scene editing
The system SHALL provide a scene editor with paragraphs, bold, italic, strike, lists, and undo/redo. Typing MUST remain possible while a save is in flight. Input latency MUST NOT wait on the network; local keystroke response MUST stay within 50 ms on a typical desktop.

#### Scenario: Basic formatting
- **WHEN** an author applies bold, italic, strike, or a list and reloads the scene
- **THEN** the formatting is present in the restored document

#### Scenario: Undo redo
- **WHEN** an author types, undoes, and redoes
- **THEN** the document matches the expected history step without a page reload

### Requirement: Three-zone writing layout
On viewports ≥1280px the system SHALL show navigator, writing sheet, and context inspector together. On 900–1279px the inspector MUST be hidden until requested. On viewports under 900px the system MUST present the scene as read-only and MUST NOT mount a rich-text editing surface. Panels MAY be collapsed without losing the current scene selection.

#### Scenario: Desktop layout
- **WHEN** an author opens a scene at width ≥1280px
- **THEN** navigator, sheet, and inspector are available in one view

#### Scenario: Mobile is read-only
- **WHEN** an author opens a scene at width under 900px
- **THEN** the scene text is visible but cannot be edited as rich text

### Requirement: Autosave with visible status
The system SHALL persist scene content automatically after 2000 ms of idle typing, and immediately on explicit save shortcut (Ctrl/Cmd+S) or after a long blur. Save MUST send document JSON, plain text, and the author's base version. Successful save MUST increment version. The UI MUST show status: saving, saved, saved on device, conflict, or error with retry. Autosave MUST NOT block keyboard input.

#### Scenario: Debounced save
- **WHEN** an author types and then pauses for at least 2000 ms while online
- **THEN** content is stored on the server and the status shows saved

#### Scenario: Immediate flush
- **WHEN** an author presses the save shortcut
- **THEN** a save is attempted immediately without waiting for the debounce

### Requirement: Offline local buffer
While the network is unavailable the system SHALL keep accepting input and store the current scene locally. Status MUST read as saved on the device. When the network returns the system MUST flush the queued scene. Confirmed text (successful sync or explicit local buffer) MUST NOT be lost after tab kill or ~5 minutes offline.

#### Scenario: Type while offline
- **WHEN** an author loses network, types additional text, and later reconnects
- **THEN** the typed text is still present and is synchronized to the server

#### Scenario: Tab killed with local buffer
- **WHEN** the author has unsynced local buffer text and the tab is closed then reopened
- **THEN** the buffered text is restored for that scene

### Requirement: Word count
The system SHALL display a live word (and character) count from scene plain text using a single shared Unicode word rule. Count MUST update without a full page reload. A 1–2 word lag during debounce MUST NOT block typing.

#### Scenario: Count updates while typing
- **WHEN** an author types additional words in a scene
- **THEN** the displayed count increases without reloading the page

### Requirement: Scene metadata and context panel
The system SHALL store scene goal, conflict, POV character, location, and participants. The inspector MUST expose tabs for the current scene, linked characters, and world/location. Linking or unlinking a character MUST NOT delete scene text. Metadata MUST survive reload.

#### Scenario: Save metadata
- **WHEN** an author sets goal, conflict, POV, and location and reloads
- **THEN** those fields are restored in the inspector

#### Scenario: Unlink character keeps text
- **WHEN** an author unlinks a character from a scene that has body text
- **THEN** the scene text is unchanged

### Requirement: Focus mode and editor shortcuts
The system SHALL provide a focus mode that emphasizes the sheet. Shortcuts MUST include: Ctrl/Cmd+S flush, Ctrl/Cmd+Shift+F focus, Alt/Option+Up/Down adjacent scene, Escape to close overlays or leave focus, Ctrl/Cmd+Z undo. Escape MUST close temporary panels.

#### Scenario: Focus mode
- **WHEN** an author enables focus mode
- **THEN** chrome recedes and the writing sheet remains editable

#### Scenario: Adjacent scene shortcut
- **WHEN** an author uses the next-scene shortcut
- **THEN** the editor opens the next scene in navigator order

### Requirement: Version history and conflict (Beta gate)
The system SHALL treat a save with a stale base version as `CONFLICT` (HTTP 409) and MUST NOT silently overwrite. Alpha MAY resolve by letting the author choose load-from-server or keep-mine. Beta MUST keep snapshots on successful text-changing saves (deduped when JSON is identical) and MUST allow restoring a snapshot. Conflict UX MUST present an explicit merge or choice; neither side MAY be discarded without the author acting.

#### Scenario: Stale version conflict
- **WHEN** two saves use the same base version and the second arrives after the first succeeded
- **THEN** the second save is rejected as conflict and the UI offers an explicit choice instead of overwriting

#### Scenario: Restore snapshot (Beta)
- **WHEN** an author restores a previous scene snapshot
- **THEN** the editor shows that content and a subsequent successful save stores it as the current version
