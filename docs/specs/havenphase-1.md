# Project Haven --- Phase 1: Authentication & Onboarding

**Project-wide reference:** `project.md`\
**Phase specification:** `phase-1.md`\
**Current state:** The public landing page is already implemented.\
**Goal:** Build secure authentication and a smooth first-time onboarding
flow while preserving the existing landing page and visual design.

------------------------------------------------------------------------

## 1. Instructions for Claude Code

Before making changes:

1.  Read `project.md` and this `phase-1.md` completely.
2.  Inspect the existing repository, including the landing page,
    framework, routes, components, styling, package manager, database
    setup, environment variables, and tests.
3.  Confirm what is already implemented and reuse it. Do not rebuild the
    landing page or replace working components.
4.  Report the existing architecture and propose a short implementation
    plan before making substantial changes.
5.  Work only on authentication, onboarding, profile setup, consent
    records, and protected-route foundations described in this document.
6.  Do not implement daily check-ins, journaling, the resource library,
    professional bookings, peer support, AI, payments, or teenage
    access.
7.  Use synthetic data in development and testing. Never use real
    mental-health data.
8.  Never commit secrets or expose privileged keys in browser code.
9.  Run the relevant checks and report actual results. Do not claim
    tests passed unless they were run.
10. At completion, list changed files, database changes, tests and
    results, known limitations, and any decisions requiring founder
    approval.

If the repository already has authentication or onboarding, audit and
improve it rather than duplicating it.

------------------------------------------------------------------------

## 2. Phase 1 objective

Implement a complete, reliable account and onboarding foundation so an
eligible adult can:

-   Create an account.
-   Verify their email.
-   Sign in and sign out.
-   Recover access if they forget their password.
-   Complete onboarding.
-   Acknowledge the applicable terms and privacy notice.
-   Save basic profile and preference information.
-   Access a protected placeholder dashboard.
-   Return to the dashboard in a later session.
-   Manage basic account information.

The existing public landing page must continue working and retain its
current visual identity.

------------------------------------------------------------------------

## 3. Scope

### In scope

-   Repository audit and preservation of existing work.
-   Authentication provider integration appropriate to the existing
    stack.
-   Registration, login, logout, and password recovery.
-   Email verification.
-   Secure session handling.
-   Adults-only eligibility flow for the initial pilot.
-   Basic onboarding wizard.
-   Minimal member profile and preferences.
-   Versioned records of required terms/privacy acknowledgements.
-   Protected dashboard placeholder.
-   Route protection and server-side authorization.
-   Database schema and access policies required for this phase.
-   Loading, validation, empty, and error states.
-   Responsive UI consistent with the existing Haven landing page.
-   Setup documentation and safe environment-variable examples.
-   Tests for authentication, onboarding, and access control.

### Out of scope

Do not build these features in Phase 1:

-   Daily mood check-ins or mood history.
-   Private journaling.
-   Self-help resource library.
-   Professional directory or therapist verification.
-   Appointment booking or video sessions.
-   Peer-support groups, community posts, or direct messaging.
-   AI companion or AI-generated mental-health advice.
-   Payments, subscriptions, advertising, or donations.
-   Teenage accounts or minor-specific experiences.
-   Clinical records, diagnosis, screening, or automated crisis
    detection.

Do not add buttons that pretend an out-of-scope feature is functional.
If the dashboard references future features, mark them clearly as
unavailable or omit them.

------------------------------------------------------------------------

## 4. Preserve the existing design

The landing page is already built. Claude must inspect it and reuse its:

-   Color palette.
-   Typography.
-   Spacing and layout conventions.
-   Button and card styles.
-   Navigation and footer.
-   Responsive behavior.
-   Existing icon or component library, if any.

The authentication and onboarding screens should feel like part of the
same Haven product. Do not redesign the landing page unless the founder
explicitly requests it.

Keep the UI calm, accessible, and supportive. Avoid clinical claims,
pressure-based prompts, shame-based language, or alarming mood scores.

------------------------------------------------------------------------

## 5. Authentication requirements

Use a reputable authentication solution compatible with the existing
architecture. **If the current project already uses Supabase, use
Supabase Auth; if it uses another working provider, assess it before
proposing a migration.** Do not introduce a second authentication system
unnecessarily.

### Registration

-   Email and password registration.
-   Clear password requirements and validation.
-   Email verification flow.
-   Friendly success and failure messages.
-   Protection against repeated or automated requests.
-   No plaintext password storage or logging.
-   Do not reveal unnecessary account-existence details in error
    messages.

### Login and logout

-   Validate credentials through the selected authentication provider.
-   Handle unverified email according to the provider's supported flow
    and the product's approved policy.
-   Keep sessions secure.
-   Logout must invalidate or clear the active session correctly.
-   Redirect authenticated users appropriately without creating redirect
    loops.

### Password recovery

-   Request a reset link.
-   Use expiring, single-use recovery links where supported.
-   Validate the recovery state before accepting a new password.
-   Provide clear success, expired-link, and failure states.
-   Do not log reset tokens or place them in analytics.

### Email verification

-   Provide a verification-pending screen.
-   Support resending verification email with sensible rate limits.
-   Handle success, expiration, and invalid verification links.
-   Ensure redirects return to the correct application origin.
-   Document required provider settings and callback URLs.

### Session handling

-   Enforce authentication on protected routes and server operations.
-   Follow the selected provider's recommended session pattern.
-   Never expose service-role keys or privileged credentials to the
    browser.
-   Handle expired sessions gracefully.
-   Do not rely on local storage or client-side state alone as proof of
    authentication.

------------------------------------------------------------------------

## 6. Onboarding flow

Build a clear, mobile-friendly onboarding wizard. Save progress safely
so a user can continue later where practical.

### Step 1 --- Welcome

Explain briefly that Haven is intended to help people find support and
practical resources. Use warm, plain language.

Do not claim that professional sessions, peer support, or other features
are already available unless they have actually launched.

### Step 2 --- Age eligibility

The initial pilot is restricted to people aged 18 and above.

-   Ask the minimum information necessary to establish eligibility.
-   Prefer a privacy-conscious eligibility method selected after legal
    review.
-   Do not collect a full date of birth unless a documented requirement
    makes it necessary.
-   Enforce eligibility on the server, not only in the UI.
-   Do not let a user bypass the gate by changing browser state or
    request payloads.
-   If the user is under 18 or eligibility cannot be established, do not
    enable pilot-only features. Provide a respectful explanation and
    general safety guidance.
-   Do not build teenage onboarding in this phase.

An age declaration is not automatically equivalent to robust age
assurance. Document the chosen approach and any unresolved legal
requirements.

### Step 3 --- Basic profile

Collect only information needed for the initial service, such as:

-   Display name (or another minimal identifier).
-   Country or region, only if needed for service eligibility or
    localization.
-   Preferred language.

Avoid asking for a diagnosis, detailed mental-health history, medication
information, or other sensitive health information during account setup.

Do not make optional fields mandatory without a clear reason.

### Step 4 --- Support preferences

Let users optionally select what they may be interested in when the
relevant features become available, for example:

-   Practical self-help resources.
-   Professional support.
-   Peer support.
-   Learning about mental wellbeing.

These are preferences only. They must not be treated as diagnoses, risk
classifications, or clinical assessments. Allow users to skip this step
and change preferences later.

Do not collect detailed explanations of why the user needs support.

### Step 5 --- Terms and privacy

-   Present the current terms and privacy notice in readable language.
-   Record required acknowledgement with the policy version and
    timestamp.
-   Separate required service terms from optional preferences or future
    data-sharing consent.
-   Do not preselect optional consent.
-   Do not bundle marketing, research, or future AI-processing consent
    into account creation.
-   If the policy text has not received required review, label it as a
    draft in development and do not falsely claim legal approval.
-   Production release requires the relevant policy review.

### Step 6 --- Completion

Show a supportive completion message and direct the user to the
protected dashboard.

The user should understand that onboarding is complete and which
features are currently available. Do not imply that a professional has
been assigned or that the user is being monitored.

### Onboarding behavior

-   Display clear progress, such as "Step 2 of 5."
-   Allow users to go back and correct previous answers.
-   Allow optional steps to be skipped.
-   Validate data on the server.
-   Persist completed steps without storing unnecessary sensitive
    details.
-   Handle refreshes, expired sessions, and interrupted onboarding.
-   Avoid duplicate profile or consent records when a user retries a
    step.
-   Make completion state authoritative on the server.
-   Prevent access to protected app features until the required steps
    are complete.

------------------------------------------------------------------------

## 7. Profile and data model

Inspect the existing database before creating migrations. Adapt the
following conceptual model to existing conventions.

### `profiles`

Suggested fields:

-   `id` --- linked to the authenticated user ID.
-   `display_name` --- optional or required only if justified.
-   `country_code` --- optional, based on service needs.
-   `preferred_language` --- optional.
-   `age_eligible` --- boolean or equivalent status, only if appropriate
    to the approved age flow.
-   `onboarding_status` --- controlled value such as `not_started`,
    `in_progress`, or `completed`.
-   `onboarding_completed_at` --- nullable timestamp.
-   `created_at`
-   `updated_at`

Do not store full date of birth by default. Avoid copying authentication
credentials into the profile table.

### `consents`

Suggested fields:

-   `id`
-   `user_id`
-   `consent_type`
-   `policy_version`
-   `accepted_at`
-   `withdrawn_at` --- nullable when applicable
-   Minimal metadata needed to evidence the action.

Record required acknowledgements and optional consent separately. A
consent record must not be used to imply that every processing activity
is automatically lawful.

### Preferences

Preferences can initially be stored in a small profile field or separate
table depending on the existing schema. Avoid storing detailed free-text
explanations or creating clinical labels.

### Database access

-   Members can read and update only their own permitted profile fields.
-   Members must not be able to mark themselves as administrators,
    professionals, or verified providers.
-   Members must not be able to mark themselves eligible through an
    untrusted client request.
-   Consent history must not be silently rewritten when a policy
    changes.
-   Use server-side validation and database access policies, such as
    Supabase Row Level Security (RLS), where applicable.
-   Test cross-user access and unauthorized field updates.

The schema is a starting point, not an instruction to create duplicate
tables. Review migrations before applying them.

------------------------------------------------------------------------

## 8. Protected dashboard

Create only a minimal dashboard shell to prove that authentication and
onboarding work.

It may contain:

-   A welcome message using the member's display name if available.
-   A short explanation that the account setup is complete.
-   Links to profile and account settings.
-   A safety-information link.
-   Clearly labeled placeholders for features planned for later phases,
    or no placeholders at all.

It must not contain fabricated check-in data, fake professional
profiles, pretend bookings, or fake community activity.

### Access rules

-   Unauthenticated visitors who open a protected route are redirected
    to login.
-   Authenticated users who have not completed required onboarding are
    redirected to onboarding.
-   Fully onboarded users can access the dashboard.
-   Users who fail age eligibility cannot access the adult pilot's
    protected features.
-   Redirect logic must avoid loops and preserve safe intended
    destinations where appropriate.
-   Authorization must be enforced server-side, not only by hiding
    navigation links.

------------------------------------------------------------------------

## 9. Account settings

Include only basic settings needed for this phase:

-   View and update allowed profile fields.
-   Change preferred language if supported.
-   Review relevant terms/privacy versions.
-   Sign out.
-   Request account deletion, if the deletion workflow can be
    implemented safely and documented.

If complete deletion cannot yet be implemented correctly, do not present
a button that falsely claims to delete an account. Instead, document the
limitation and obtain founder approval for the temporary request process
before launch.

Deletion must account for related profile and consent records, backups,
and any applicable retention obligations. Do not claim immediate removal
from every backup unless that is technically accurate.

------------------------------------------------------------------------

## 10. Security and privacy requirements

-   Validate all submitted data on the server.
-   Enforce authorization for every protected operation.
-   Use database-level policies where supported.
-   Keep privileged keys server-only.
-   Do not commit real secrets.
-   Use secure session settings recommended by the chosen provider.
-   Rate-limit authentication and verification-resend actions.
-   Avoid exposing detailed account-existence information in responses.
-   Do not log passwords, tokens, recovery links, or private
    mental-health details.
-   Do not add third-party analytics or chat tools that collect
    sensitive data without review.
-   Do not request clinical history during onboarding.
-   Use synthetic data in development and staging.
-   Keep development, staging, and production credentials separate.
-   Document privacy and age-eligibility assumptions that require
    professional review.

------------------------------------------------------------------------

## 11. Error and loading states

Implement clear, accessible states for:

-   Invalid registration data.
-   Existing account or generic registration failure.
-   Verification email pending.
-   Expired or invalid verification link.
-   Invalid login.
-   Password reset requested.
-   Expired or invalid password recovery link.
-   Network or service failure.
-   Session expiration.
-   Incomplete onboarding.
-   Ineligible age declaration.
-   Profile save failure.
-   Consent save failure.

Do not display raw stack traces, SQL errors, provider secrets, or
sensitive internal details to users.

------------------------------------------------------------------------

## 12. Testing requirements

Use synthetic test accounts.

### Authentication tests

-   Registration works.
-   Email verification flow works in the configured test environment.
-   Login and logout work.
-   Password recovery flow works.
-   Expired or invalid links are handled safely.
-   Rate limits or provider protections are configured and documented.
-   Session expiration is handled correctly.

### Onboarding tests

-   Each step validates input.
-   Users can go back and correct answers.
-   Optional preferences can be skipped.
-   Refreshing the page does not create duplicate records.
-   Onboarding progress persists as designed.
-   Completion status is stored and enforced on the server.
-   Ineligible users cannot access the adult pilot dashboard.
-   Client-side edits cannot override eligibility or onboarding status.

### Authorization tests

-   Unauthenticated users cannot access protected pages or operations.
-   Member A cannot read or edit Member B's profile.
-   Members cannot change privileged role fields.
-   Members cannot rewrite historical consent records.
-   Users cannot set their own eligibility or verification status
    through untrusted requests.
-   Database access policies are tested, not merely present.

### Quality checks

Run the repository's supported commands for linting, type checking,
tests, and production build. Record the exact commands and results.

------------------------------------------------------------------------

## 13. Acceptance checklist

Phase 1 is complete when all applicable requirements have evidence:

-   [ ] Existing landing page is preserved.
-   [ ] Repository and existing integrations were inspected before
    implementation.
-   [ ] Registration and login work.
-   [ ] Email verification works in the configured environment.
-   [ ] Logout and password recovery work.
-   [ ] Sessions are handled using the provider's secure recommended
    approach.
-   [ ] Onboarding includes adult eligibility, minimal profile details,
    optional preferences, and required policy acknowledgement.
-   [ ] Onboarding progress and completion are persisted and enforced
    server-side.
-   [ ] Protected dashboard access rules work.
-   [ ] Account settings are available.
-   [ ] Database policies prevent cross-user access and unauthorized
    role/eligibility changes.
-   [ ] No privileged secrets are exposed in browser code or committed.
-   [ ] No unnecessary sensitive health information is collected.
-   [ ] Loading, success, and error states are accessible.
-   [ ] Authentication, onboarding, and authorization tests have been
    run.
-   [ ] Setup documentation and `.env.example` are accurate.
-   [ ] Known limitations and unresolved policy/legal decisions are
    documented.
-   [ ] No later-phase features have been implemented.

Do not mark a checklist item complete without implementation evidence or
test results.

------------------------------------------------------------------------

## 14. Suggested implementation sequence

Claude should work in small tasks and pause for review between
substantial steps.

1.  Audit the repository and report the current state.
2.  Confirm the auth/database provider based on existing code.
3.  Implement authentication and protected routing.
4.  Implement the minimal profile model and access policies.
5.  Implement the onboarding wizard and server-side progress tracking.
6.  Implement terms/privacy acknowledgement records.
7.  Implement the protected dashboard shell and basic account settings.
8.  Add automated tests for authentication, onboarding, and
    authorization.
9.  Update setup instructions and verify lint, type checks, tests, and
    build.

Do not begin the next substantial task until the current task has been
reviewed.

------------------------------------------------------------------------

## 15. Prompt to give Claude Code

> Read `project.md` and `phase-1.md` completely. The landing page is
> already built and must be preserved. Inspect the repository before
> changing any files and report the existing framework, package manager,
> routes, components, styling, auth/database integrations, environment
> variables, tests, and code that should be reused. Then propose a small
> implementation plan for Phase 1: authentication, adult eligibility,
> onboarding, minimal profile and consent records, protected dashboard,
> and basic account settings. Use the existing stack where practical; do
> not introduce a second auth system or perform a disruptive rewrite
> without approval. Do not implement check-ins, journaling, resources,
> professional bookings, peer support, AI, payments, or teenage access.
> Enforce authorization on the server and database. Use synthetic data,
> protect secrets, run relevant tests, and report actual results. Wait
> for my approval before making substantial changes.

------------------------------------------------------------------------

## Phase boundary

Phase 1 ends when authentication, onboarding, profile/consent
persistence, and protected dashboard access work reliably and are
tested. All later product capabilities remain out of scope.
