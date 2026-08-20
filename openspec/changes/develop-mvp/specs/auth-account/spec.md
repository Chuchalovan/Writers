## Purpose

Lets authors create an account, keep a session, and later confirm email, recover access, edit a profile, and delete the account with a data export.

## ADDED Requirements

### Requirement: Email registration
The system SHALL allow a guest to create an account with email and password. On success the system MUST establish a session and give access to the application. Validation errors MUST be shown next to the relevant field in the UI language (`ru` or `en`). Password MUST be at least 8 non-empty trimmed characters.

#### Scenario: Successful registration
- **WHEN** a guest submits a valid unused email and a password of at least 8 characters
- **THEN** an account is created, a session is established, and the user can open the projects dashboard

#### Scenario: Invalid registration input
- **WHEN** the guest submits an empty title-trimmed password, a short password, or a malformed email
- **THEN** the account is not created and a field-level validation message is shown

### Requirement: Sign-in and sign-out
The system SHALL allow an author to sign in with email and password and to sign out. Sign-out MUST end the session. After at most 5 failed sign-in attempts per 10 minutes for the same IP and email, the system MUST reject further attempts with `RATE_LIMITED` until the window expires.

#### Scenario: Successful sign-in
- **WHEN** an author submits correct credentials
- **THEN** a session is established and protected routes become available

#### Scenario: Sign-out
- **WHEN** an author signs out
- **THEN** the session ends and protected routes are no longer available without signing in again

#### Scenario: Login rate limit
- **WHEN** more than 5 failed sign-in attempts occur within 10 minutes for the same IP and email
- **THEN** the system returns `RATE_LIMITED` and does not reveal whether the email exists beyond the normal sign-in error

### Requirement: Session-gated routes
The system SHALL redirect unauthenticated visitors of protected routes to sign-in and MUST restore the intended destination after successful authentication when a callback URL is present. Missing session on a mutating API or action MUST yield `UNAUTHORIZED` (HTTP 401).

#### Scenario: Unauthenticated dashboard visit
- **WHEN** a guest opens a protected projects route
- **THEN** the system redirects to sign-in and, after successful sign-in, returns the user to that route

### Requirement: Email confirmation (Beta)
The system SHALL require email confirmation before AI use, account deletion, full-account export, and email change. Unconfirmed authors MUST still use projects, structure, editor, knowledge, and current-project export. The system MUST keep one active confirmation token per user with a 24-hour TTL; resending MUST invalidate the previous link. A persistent banner MUST offer resend. Denied sensitive actions MUST return `EMAIL_NOT_VERIFIED`.

#### Scenario: Unconfirmed author can write
- **WHEN** an unconfirmed author opens a project and edits a scene
- **THEN** writing, structure, knowledge, and current-project export remain available

#### Scenario: Unconfirmed author blocked from AI
- **WHEN** an unconfirmed author starts an AI request
- **THEN** the system refuses with `EMAIL_NOT_VERIFIED` and does not call the provider

### Requirement: Password reset (Beta)
The system SHALL send a password-reset link with a 1-hour TTL and a single active token. Success MUST invalidate all of the user's sessions. The reset request UX MUST be identical whether or not the email exists (no email enumeration).

#### Scenario: Successful reset
- **WHEN** an author completes reset with a valid link and a new valid password
- **THEN** the new password is accepted, previous sessions are invalid, and the author can sign in with the new password

#### Scenario: Unknown email on reset request
- **WHEN** a guest requests reset for an email that has no account
- **THEN** the UI shows the same success-style message as for an existing account and does not confirm that the email is unused

### Requirement: Profile (Beta)
The system SHALL allow an authenticated author to update display name and avatar. Changes MUST persist and appear in the UI after reload.

#### Scenario: Update name
- **WHEN** an author saves a new display name
- **THEN** the name is stored and shown in the header and settings after reload

### Requirement: Account deletion with export (Beta)
The system SHALL delete an account only after explicit confirmation (password or typed account email). It MUST offer a full-account data export first. If export fails, deletion MUST NOT proceed unless the author additionally confirms «delete without export». After success, sessions MUST be ended and sign-in MUST fail. Content MAY remain for operator retention up to 30 days but MUST be inaccessible to the user. If the final delete step fails, the account MUST remain usable.

#### Scenario: Delete blocked when export fails
- **WHEN** the author confirms deletion but account export fails and «delete without export» is not confirmed
- **THEN** the account remains active and no projects are removed from the author's access

#### Scenario: Successful delete after export
- **WHEN** the author confirms deletion after a successful export (or after explicitly confirming delete without export)
- **THEN** sessions end, sign-in fails, and the author's projects are no longer accessible to that account
