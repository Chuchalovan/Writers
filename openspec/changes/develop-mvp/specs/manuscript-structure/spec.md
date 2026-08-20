## Purpose

Lets authors build and rearrange a manuscript tree of parts, chapters, and scenes, including unassigned scenes, statuses, and recoverable soft delete.

## ADDED Requirements

### Requirement: Hierarchical node CRUD
The system SHALL allow creating, renaming, and listing parts, chapters, and scenes in a project the author owns. Hierarchy MUST be part ⊃ chapter ⊃ scene. A scene MAY exist without a parent (unassigned). Titles MUST be 1–200 characters when set. Nodes of another author's project MUST be inaccessible.

#### Scenario: Create nested chapter and scene
- **WHEN** an author creates a part, a chapter under that part, and a scene under that chapter
- **THEN** the tree persists and reloads with the same parent relationships

#### Scenario: Unassigned scene
- **WHEN** an author creates a scene with no parent
- **THEN** the scene is stored and appears as unassigned, not under a chapter

### Requirement: Scene status
The system SHALL support scene statuses `idea`, `planned`, `draft`, `revision`, and `ready`. Status MUST apply only to scene nodes. Changing status MUST NOT block editing the scene text. Status MUST be visible in the navigator (icon plus label, not color alone).

#### Scenario: Status does not lock editor
- **WHEN** an author sets a scene to `ready` and then types in the editor
- **THEN** the text is accepted and can be saved

#### Scenario: Status rejected on non-scene
- **WHEN** an author attempts to set status on a part or chapter
- **THEN** the system rejects the change with a validation error

### Requirement: Reorder and move
The system SHALL persist sibling order, including drag-and-drop, after reload. Reorder MUST apply only to children of the same parent. Moving a node MUST NOT make an ancestor a descendant of itself. If saving order fails, the UI MUST revert and notify the author. Canonical order MUST be `position`, then id.

#### Scenario: Drag-and-drop persists
- **WHEN** an author reorders two scenes under the same chapter and reloads
- **THEN** the new order is shown

#### Scenario: Cycle rejected
- **WHEN** an author attempts to move a part under one of its descendant scenes
- **THEN** the system rejects the move and the tree is unchanged

### Requirement: Soft delete and restore
The system SHALL soft-delete a node only after UI confirmation. Children MUST be soft-deleted together with the parent. Deleted nodes MUST be hidden from the default tree and restorable from the project trash. Repeating delete on an already soft-deleted node MUST succeed without a server error. Hard delete MUST NOT be available in MVP UI.

#### Scenario: Cascade soft delete
- **WHEN** an author confirms delete of a chapter that has scenes
- **THEN** the chapter and those scenes disappear from the default tree and can be restored from trash

#### Scenario: Restore
- **WHEN** an author restores a soft-deleted node from project trash
- **THEN** the node (and its previously cascaded children) reappear in the tree

### Requirement: Title search in navigator
The system SHALL filter the manuscript tree by a title substring within the current project. Matching MUST be scoped to that project only.

#### Scenario: Filter by title
- **WHEN** an author types a substring that matches one scene title
- **THEN** the navigator shows matching nodes of that project and not other projects
