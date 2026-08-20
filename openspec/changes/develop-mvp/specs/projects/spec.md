## Purpose

Lets authors create book projects by title only, manage them on a dashboard, pick an onboarding path, and resume work from a project overview.

## ADDED Requirements

### Requirement: Create project by title
The system SHALL create a project when the author provides a non-empty title of 1–200 trimmed characters. Canceling the create dialog MUST NOT create a project. Empty title MUST fail validation and MUST NOT create a project.

#### Scenario: Successful create
- **WHEN** an author submits a title of 1–200 characters
- **THEN** a project owned by that author is stored and appears in the project list

#### Scenario: Empty title rejected
- **WHEN** an author submits a blank or whitespace-only title
- **THEN** the system shows a validation error and does not create a project

#### Scenario: Cancel create
- **WHEN** an author opens the create dialog and cancels
- **THEN** no project is created

### Requirement: Dashboard list
The system SHALL list the author's projects as cards showing title and last activity. Default sort MUST be last updated descending. Archived projects MUST be hidden by default. Opening a card MUST navigate to the project overview.

#### Scenario: Default list hides archive
- **WHEN** an author opens the dashboard with some archived and some active projects
- **THEN** only non-archived projects appear, newest activity first

### Requirement: Search, filter, and archive on dashboard
The system SHALL let the author search projects by title and include archived projects when requested. An empty search result MUST show an empty state, not a blank error. Archiving MUST set archived status and hide the project from the default list.

#### Scenario: Search by title
- **WHEN** an author types a title substring on the dashboard
- **THEN** only matching projects of that author are shown

#### Scenario: Empty search
- **WHEN** the query matches no projects
- **THEN** an empty state is shown

#### Scenario: Archive
- **WHEN** an author archives a project
- **THEN** the project is hidden from the default list and remains available when archived items are included

### Requirement: Rename, duplicate, and delete
The system SHALL allow renaming, duplicating, and deleting a project the author owns. Deletion MUST require confirmation. Duplication MUST copy manuscript tree and knowledge entities into a new project and MUST NOT alter the source. Another author's project MUST NOT be readable or mutable (`FORBIDDEN` / not found in the author's scope).

#### Scenario: Duplicate preserves source
- **WHEN** an author duplicates a project that has nodes and characters
- **THEN** a new project contains copies of that tree and knowledge, and the original project is unchanged

#### Scenario: Delete requires confirmation
- **WHEN** an author requests delete without confirming
- **THEN** the project remains

### Requirement: Onboarding paths after create
After creating a project the system SHALL offer three paths: start writing, plan structure, and add materials. Each path MUST open a relevant screen (first scene editor, structure navigator, or knowledge). None of the paths MAY require filling extra project fields.

#### Scenario: Start writing
- **WHEN** an author chooses «start writing» after create
- **THEN** the system opens a scene editor for that project so the author can type immediately

#### Scenario: Plan structure
- **WHEN** an author chooses «plan structure» after create
- **THEN** the system opens the manuscript navigator for that project

### Requirement: Project overview
The system SHALL show an overview with one primary continue action (last scene when available), progress that does not invent a completion percentage without a volume goal, and 1–3 next-step suggestions. An empty project MUST show onboarding hints instead of a fake readiness percentage.

#### Scenario: Resume after a break
- **WHEN** an author opens a project that has a last edited scene
- **THEN** overview offers a single primary action that opens that scene

#### Scenario: Empty project has no fake percent
- **WHEN** an author opens a newly created project with no scenes or word goal
- **THEN** overview does not display a completion percentage and shows onboarding next steps
