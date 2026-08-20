## Purpose

Lets authors describe characters and locations, keep other world articles, record relationships between characters, and find entities by title inside the current project.

## ADDED Requirements

### Requirement: Character cards
The system SHALL allow creating, updating, listing, and deleting character cards. `name` MUST be required (1–200 characters). Role, short description, appearance, motivation, and notes MUST be optional and MUST NOT block save. A character without a name MUST NOT be stored. Delete MUST require confirmation. Deleting a character MUST remove participation links and MUST NOT delete scene text.

#### Scenario: Create with name only
- **WHEN** an author saves a character with a name and empty optional fields
- **THEN** the card is stored and can be opened from the character list and from a scene inspector

#### Scenario: Missing name rejected
- **WHEN** an author attempts to save a character with a blank name
- **THEN** the system rejects the save and no card is created

### Requirement: Character-scene links
The system SHALL allow linking and unlinking a character to a scene in the same project. Links MUST appear on the character card and/or the scene context panel. Unlinking MUST NOT cascade-delete the character or the scene body.

#### Scenario: Link from scene
- **WHEN** an author adds a character as a scene participant
- **THEN** the character appears in the scene context and the scene appears among the character's scenes

### Requirement: Location descriptions
The system SHALL treat a location as a world article with type `location`. Title MUST be required. Description, tags, and notes MUST be optional. A location MUST be selectable as a scene's location and listed in the world section.

#### Scenario: Create location
- **WHEN** an author saves a location with a title and description
- **THEN** it appears in World and can be chosen as a scene location

#### Scenario: Missing title rejected
- **WHEN** an author attempts to save a location without a title
- **THEN** the system rejects the save

### Requirement: Other world articles
The system SHALL allow CRUD for other world article types (at least organization and rule, plus location) with required title, a type, and a description field. Delete MUST require confirmation and MUST NOT delete scene text.

#### Scenario: Create organization article
- **WHEN** an author creates a world article of a non-location type with a title
- **THEN** it is stored in World and can be opened later

### Requirement: Relationships between characters
The system SHALL allow a relationship between two different characters of the same project with a type (`family`, `ally`, `enemy`, `romantic`, `mentor`, `other`) and optional comment/label. A character MUST NOT be related to itself. A duplicate canonical pair plus type MUST update the comment instead of inserting a second row. Symmetric relationships MUST appear on both cards as one entity. A visual relationship graph MUST NOT be required in MVP. Deleting a relationship MUST NOT delete the characters.

#### Scenario: Create relationship
- **WHEN** an author links character A to character B as `ally` with a comment
- **THEN** the relationship is visible on A's card and, if symmetric, on B's card

#### Scenario: Self-link rejected
- **WHEN** an author tries to relate a character to itself
- **THEN** the system rejects the save

#### Scenario: Duplicate pair updates
- **WHEN** an author saves the same canonical pair and type again with a new comment
- **THEN** a single relationship remains with the updated comment

### Requirement: Title search across knowledge
The system SHALL search the current project by title across manuscript nodes, characters, and world articles. Results MUST be grouped by type and MUST open the selected entity. Search MUST NOT return other authors' projects.

#### Scenario: Find character by name
- **WHEN** an author searches the project for a character's name
- **THEN** that character appears in results and opening it shows the card
