## Purpose

Lets authors plan plot with a method and board, keep a simple event timeline and notes, search full text, and run commands from a keyboard palette in Beta.

## ADDED Requirements

### Requirement: Plot method selection
The system SHALL let the author choose exactly one plot method for a project: `blank`, `three-act`, `heros-journey`, or `beat-sheet`. Choosing a method MUST create or refresh beat scaffolding without deleting scene text. Changing method MUST warn before recreating beats. Method labels in the UI MUST use plain language, not unexplained jargon. Methods beyond the four MUST NOT be required for Beta.

#### Scenario: Start with blank
- **WHEN** an author keeps or selects `blank`
- **THEN** the project has no mandatory beat template and writing remains available

#### Scenario: Apply three-act
- **WHEN** an author selects `three-act` and confirms
- **THEN** beat scaffolding for that method is present and existing scene text is unchanged

### Requirement: Plot board
The system SHALL present plot beats as cards that the author can reorder, including drag-and-drop. Cards MAY be linked to storylines. Order MUST persist after reload. The board MUST NOT block writing if the author ignores it.

#### Scenario: Reorder beats
- **WHEN** an author drags a beat card to a new position and reloads
- **THEN** the board shows the saved order

### Requirement: Timeline as a list
The system SHALL store timeline events ordered by story time. The UI MUST warn when event order conflicts with manuscript order, without hard-blocking save. A visual scalable timeline MUST NOT be required in MVP.

#### Scenario: Create and sort events
- **WHEN** an author adds two events with different story times
- **THEN** the list is ordered by story time after reload

#### Scenario: Order warning is not a hard block
- **WHEN** an event's story order disagrees with scene order
- **THEN** the system shows a warning and still allows the author to keep the event

### Requirement: Notes and materials
The system SHALL allow notes with text and links, optionally attached to project entities. File attachments MUST follow quota and MIME allow-list (images JPEG/PNG/WebP/GIF; per-file and per-project caps). Exceeding quota MUST fail with a payload-too-large error and MUST NOT corrupt existing notes.

#### Scenario: Create a text note
- **WHEN** an author saves a note with text linked to a character
- **THEN** the note is listed in Notes and from that character

#### Scenario: Oversized file rejected
- **WHEN** an author uploads a file over the per-file cap
- **THEN** the upload is rejected and existing notes remain intact

### Requirement: Full-text search
The system SHALL search project plain text (scenes and knowledge fields in scope) and highlight matches. Latency MUST be within 1 second on a typical mid-size project. Results MUST be limited to the current author's current project.

#### Scenario: Find a phrase in a scene
- **WHEN** an author searches for a unique phrase that exists only in one scene
- **THEN** that scene is in results with a highlight and opens the scene

### Requirement: Command palette
The system SHALL open a command palette on Ctrl/Cmd+K. The palette MUST search commands and project entities by title and MUST be fully usable from the keyboard.

#### Scenario: Open entity from palette
- **WHEN** an author presses Ctrl/Cmd+K, types a character name, and confirms
- **THEN** the character card opens

### Requirement: World backlinks
The system SHALL show reverse links for a world article or character: scenes and notes that reference or bind that entity.

#### Scenario: Location backlinks
- **WHEN** two scenes use the same location
- **THEN** that location's detail view lists both scenes
