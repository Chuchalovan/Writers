## Purpose

Lets authors take a manuscript out as files and, in Beta, bring drafts back in with a preview so the project is never silently duplicated or corrupted.

## ADDED Requirements

### Requirement: Export DOCX and TXT (Alpha)
The system SHALL export a chosen scope as DOCX or TXT: whole project, one part, or a set of scene ids. Node order MUST follow tree position. TXT MUST include heading levels and a blank line between scenes. DOCX MUST use the same heading levels and basic marks. Empty scope MUST fail validation and MUST NOT create a file. Generation failure MUST return `EXPORT_FAILED` and MUST leave project data unchanged.

#### Scenario: Export whole project as TXT
- **WHEN** an author exports the project as TXT with at least one scene
- **THEN** a UTF-8 text file downloads with headings and scene bodies in tree order

#### Scenario: Export DOCX opens in standard tools
- **WHEN** an author exports a part as DOCX
- **THEN** a DOCX file downloads that opens in common office software with headings and basic formatting

#### Scenario: Empty scope rejected
- **WHEN** an author confirms export with no scenes selected
- **THEN** the system shows a validation error and does not produce a file

#### Scenario: Failed generation
- **WHEN** file generation fails after a valid export request
- **THEN** the author sees an error, can retry, and scene content in the database is unchanged

### Requirement: Extended export (Beta)
The system SHALL additionally export PDF, Markdown, and a ZIP archive of format `manuscript-export` version 1. PDF MUST be readable text with a table of contents; print-shop layout is not required. ZIP MUST be UTF-8 and MUST include `manifest.json`, tree, scene JSON, characters, relationships, and world articles as specified in the product TZ. Entity ids inside a ZIP used for re-import MUST be treated as portable data, not as live database ids.

#### Scenario: Markdown export
- **WHEN** an author exports the project as Markdown
- **THEN** a Markdown file downloads with heading hierarchy matching the tree

#### Scenario: ZIP contains manifest
- **WHEN** an author exports ZIP
- **THEN** the archive contains `manifest.json` with `format` `manuscript-export` and `version` 1 plus manuscript and knowledge files

### Requirement: Import with preview (Beta)
The system SHALL import TXT/paste as a single new scene in a chosen chapter or as unassigned, with preview. Markdown and DOCX headings MUST map H1→part, H2→chapter, H3+→scene; files without headings MUST become one scene. ZIP v1 MUST create a new project or fill only a newly created empty project; imported ids MUST be regenerated. One confirmed import MUST create each entity once. Re-uploading the same file MUST create another copy only after explicit «import again» on preview. Silent merge by title MUST NOT occur. Canceling preview MUST NOT change the project. Broken files MUST error without mutating data. Size limits MUST be enforced (DOCX/TXT/MD ≤ 10 MB, ZIP ≤ 50 MB) with `PAYLOAD_TOO_LARGE`.

#### Scenario: TXT import preview
- **WHEN** an author uploads a TXT file
- **THEN** a preview is shown and confirming creates exactly one new scene without duplicates

#### Scenario: Cancel preview
- **WHEN** an author cancels import on preview
- **THEN** the project is unchanged

#### Scenario: ZIP regenerates ids
- **WHEN** an author imports a valid `manuscript-export` v1 ZIP into a new project
- **THEN** entities are created with new ids and no collision with existing database ids

#### Scenario: Oversized import
- **WHEN** an author uploads an import file larger than the format cap
- **THEN** the system rejects with `PAYLOAD_TOO_LARGE` and does not create entities

### Requirement: Feature flag for import
Import MUST be disableable at Beta without a code deploy. When disabled, the import UI MUST be unavailable and import endpoints MUST refuse the operation.

#### Scenario: Import disabled
- **WHEN** the import flag is off
- **THEN** the author cannot complete an import and existing projects remain intact
