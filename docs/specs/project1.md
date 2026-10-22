# Project Haven --- Product & Engineering Specification

**Document type:** Living project specification\
**Version:** 1.0\
**Status:** Planning baseline\
**Product category:** Free-access mental health support platform\
**Primary initial pilot:** Adults aged 18+ in a limited set of launch
jurisdictions\
**Long-term audience:** Teenagers and adults globally, subject to
jurisdiction-specific readiness\
**Core model:** Volunteer professional support + moderated peer
support + practical self-help\
**Working name:** Project Haven (temporary; branding and naming are not
finalized)

------------------------------------------------------------------------

## 0. How Claude should use this file

This file is the canonical project context for planning, implementing,
reviewing, and extending Project Haven. Read it before starting work in
any phase.

### Rules for Claude

1.  **Treat this file as the source of truth.** If a task conflicts with
    it, identify the conflict and ask before changing product direction.
2.  **Do not implement the entire product at once.** Work in the current
    phase and its acceptance criteria. Keep changes small, testable, and
    reversible.
3.  **Inspect the existing repository first.** Before editing, inspect
    the file tree, package scripts, framework versions, current
    implementation, environment configuration, and existing conventions.
    Do not overwrite working code or recreate files blindly.
4.  **Preserve existing project conventions** unless there is a concrete
    reason to change them. Explain material architectural changes before
    making them.
5.  **Never invent integrations, environment variables, API keys, legal
    approvals, provider verification, or completed features.** Mark
    assumptions explicitly.
6.  **Prefer secure, maintainable, boring technology** over unnecessary
    complexity. Start with a modular monolith, not microservices.
7.  **Do not use real sensitive mental-health information in
    development, tests, logs, screenshots, analytics, or AI prompts.**
    Use synthetic test data.
8.  **Do not claim that a safety control makes the platform clinically
    safe without appropriate review and testing.** Build technical
    controls, but clearly identify the need for qualified clinical,
    safeguarding, privacy, and legal review.
9.  **Do not introduce AI into the critical path of booking, crisis
    response, credential verification, or authorization.** AI is a
    later, optional feature.
10. **Never expose secrets.** Do not commit `.env` files, service-role
    keys, private credentials, tokens, or production data. Use
    environment variables and secret management.
11. **Use server-side authorization and database-level access
    controls.** Hiding UI elements is not authorization.
12. **Do not weaken security to make a feature work.** If a secure
    implementation is unclear, explain the risk and propose a safe
    alternative.
13. **Test the feature you implement.** Run relevant linting, type
    checks, unit tests, integration tests, and build checks when
    available. Report exact commands and results; do not claim tests
    passed unless they ran.
14. **Update project documentation** when architecture, environment
    variables, database schema, setup instructions, security behavior,
    or phase status changes.
15. **Before finishing each task, report:** what changed, important
    files, tests run and results, known limitations, security/privacy
    considerations, and the next recommended task.
16. **Avoid scope creep.** Do not add subscriptions, payments,
    advertising, public social profiles, streak-based pressure, or
    unrequested features without approval.
17. **Do not assume global clinical availability.** The platform may be
    globally accessible as a website while professional services are
    offered only where legal, operational, and safeguarding requirements
    have been met.
18. **Keep teenagers out of the live service until the separate
    minor-safeguarding release gate is approved.** Design for future
    age-aware support where reasonable, but do not enable minors by
    default in the initial adult pilot.
19. **Be explicit about mock data.** Clearly label demo providers, fake
    bookings, and placeholder resources as non-production data. Never
    present unverified professionals as verified.
20. **When uncertain, stop and explain the decision needed rather than
    silently making a high-impact assumption.**

### Expected workflow for each task

1.  Read this file and the relevant existing source files.
2.  Summarize the task, assumptions, and affected areas.
3.  Propose a short implementation plan.
4.  Implement only the agreed scope.
5.  Test and inspect the resulting diff.
6.  Update relevant documentation and this file's phase checklist if
    appropriate.
7.  Summarize outcomes, remaining risks, and next steps.

------------------------------------------------------------------------

## 1. Product vision

Project Haven is a privacy-first mental health support platform intended
to help people find appropriate human support and practical resources
without paying for essential member features.

The product brings together:

-   **Professional support:** Verified, appropriately qualified
    professionals who volunteer a limited amount of time to offer free
    sessions within their permitted scope and service jurisdictions.
-   **Peer support:** Moderated communities and trained non-clinical
    listeners who provide empathy and signposting.
-   **Self-help:** Daily check-ins, journaling, educational resources,
    and manageable activities.
-   **Future optional AI assistance:** Clearly disclosed, bounded,
    supportive assistance that complements---not replaces---human
    support.

### Product promise

> A safe place to talk, find support, and take your next step ---
> without having to pay for the basics.

### Core principles

1.  Human connection before automation.
2.  Free access to essential member features.
3.  Privacy by default and minimal data collection.
4.  Safety and safeguarding as product requirements.
5.  Respect, dignity, accessibility, and cultural sensitivity.
6.  No shame-based engagement design.
7.  Honest expectations about availability and response times.
8.  Evidence-informed self-help content with appropriate review.
9.  Clear distinction between clinical care, peer support, and AI.
10. Global ambition with jurisdiction-specific service readiness.

### What Project Haven is not

-   It is not an emergency service or crisis hotline unless a separately
    staffed, qualified operation is explicitly established.
-   It is not a substitute for diagnosis, psychotherapy, medication
    management, or emergency care.
-   It must not claim that AI diagnoses, treats, or reliably detects
    every crisis.
-   It is not a public repository of members' mental health histories.
-   It is not a lead-selling marketplace or advertising platform built
    around sensitive health information.

------------------------------------------------------------------------

## 2. Product strategy

### Primary problem

People experiencing depression, loneliness, anxiety, grief, stress, or
other emotional difficulties may need someone to talk to or practical
support but face barriers such as cost, stigma, limited local
availability, uncertainty about where to start, and difficulty
navigating services.

### Initial value proposition

A member can create an account, access reviewed self-help resources,
complete optional daily check-ins, find verified providers with
genuinely available free sessions, and participate in a moderated
peer-support experience.

### Differentiators

-   Essential member features are free.
-   Human professional support and peer support coexist with self-help.
-   Free session availability is displayed honestly.
-   The experience emphasizes small, achievable steps rather than
    pressure or streaks.
-   Members retain meaningful control over private reflections and
    sharing.
-   The platform distinguishes provider credentials and service
    boundaries clearly.
-   The system is designed to grow internationally without pretending
    one policy or credential is valid everywhere.

### Initial audience

The long-term audience includes teenagers and adults globally. The
**first live pilot should be limited to adults aged 18+** in selected
jurisdictions. Teenage access is a later release requiring a dedicated
child-safeguarding, consent, privacy, clinical, and legal review.

### Initial service model

-   Free member accounts and essential features.
-   Free sessions subject to verified volunteer capacity.
-   Moderated peer-support spaces.
-   Curated self-help content.
-   Optional donations, grants, philanthropic funding, and institutional
    sponsorship may support operations later.
-   No sale of personal mental-health data and no advertising targeting
    based on mental-health information.

------------------------------------------------------------------------

## 3. Scope and phased delivery

### Phase 0 --- Discovery, governance, and service readiness

**Goal:** Validate the problem and establish minimum operating policies
before handling sensitive real user information.

Deliverables: - User and provider interviews. - Initial
launch-jurisdiction decision. - Product requirements and wireframes. -
Clinical adviser and safeguarding adviser identified. - Privacy and
data-flow review. - Draft consent, privacy, community, and provider
policies. - Provider verification and volunteer onboarding procedure. -
Crisis resource and incident-response plan. - Initial content-review
process. - Definition of adult pilot capacity and service hours.

**Exit criteria:** - Initial service geography selected. - Responsible
owner identified for safeguarding and incident handling. - No unresolved
high-risk assumptions about provider eligibility or crisis promises. -
MVP scope approved.

### Phase 1 --- Secure foundations and member self-help

**Goal:** Build a secure, usable web app with accounts, consent,
check-ins, and reviewed resources.

Deliverables: - Responsive public website. - Authentication and account
recovery. - Member profile and preferences. - Consent records. - Daily
check-in. - Private journal, if included in the approved initial
scope. - Resource library. - Privacy settings and account deletion
workflow. - Initial admin access and audit logging. - Staging
environment and synthetic seed data.

**Exit criteria:** - Authorization tests pass. - Private data is not
exposed to other members. - Account lifecycle and deletion behavior are
documented and tested. - Production secrets are not in source control. -
Content is reviewed and labeled appropriately.

### Phase 2 --- Professional directory and free booking

**Goal:** Enable approved professionals to publish availability and
members to request free sessions.

Deliverables: - Professional application workflow. - Verification status
and admin review. - Public directory of approved providers only. -
Provider specialties, languages, permitted service jurisdictions,
session type, and availability. - Booking, cancellation, and
rescheduling. - Concurrency-safe slot reservation. - Notifications and
reminder jobs. - Provider dashboard. - Operational booking audit
trail. - Clear disclosure of free-session limits and service
availability.

**Exit criteria:** - Unapproved providers cannot appear as verified. -
Double-booking tests pass. - Time zones and daylight-saving transitions
are handled. - Cancellation and no-show flows are documented. - Session
access is restricted to authorized participants. - The platform does not
claim to provide immediate or continuous crisis monitoring.

### Phase 3 --- Moderated peer support

**Goal:** Offer a bounded, reportable, and actively moderated community.

Deliverables: - Topic-based groups. - Pseudonymous display names where
appropriate. - Posting and commenting. - Community guidelines and
onboarding. - Report, block, hide, and moderator action flows. - Rate
limiting and anti-spam controls. - Moderator queue and restricted
incident records. - Published moderation coverage and response
expectations.

**Exit criteria:** - Users can report harmful content. - Moderators can
remove content and restrict accounts. - Moderator actions are logged
with appropriate access restrictions. - Community launch has sufficient
moderation capacity. - Direct messaging is not enabled unless separately
reviewed and approved.

### Phase 4 --- Controlled adult pilot and refinement

**Goal:** Validate actual usefulness and operational reliability with a
small adult cohort.

Deliverables: - Pilot onboarding and consent. - Limited provider
capacity and transparent wait times. - User feedback collection using
minimal data. - Support and incident-handling workflow. - Metrics
dashboard using aggregated, privacy-conscious data. - Usability,
accessibility, and security remediation.

**Exit criteria:** - No unresolved critical security issues. - Incident
response and escalation routes have been exercised. - Provider and
moderation operations can meet published expectations. - Pilot feedback
is reviewed before expansion. - Service geography and capacity are
approved for the next stage.

### Phase 5 --- Optional AI assistance and personalization

**Goal:** Add carefully bounded AI only after core human-support
workflows are reliable.

Potential features: - Optional supportive conversation. -
Recommendations from an approved resource catalogue. - Breaking tasks
into smaller steps. - Plain-language explanations of platform
resources. - User-controlled reflection summaries.

Requirements: - Clear disclosure that the user is interacting with AI. -
No diagnosis, medication changes, or claims of guaranteed recovery. - No
use of AI as the sole crisis-response mechanism. - Privacy and vendor
review before transmitting user content. - Data minimization and clear
retention terms. - Safety evaluations and human review of the intended
use. - Ability to use core platform features without AI.

### Phase 6 --- Teenage access

**Goal:** Introduce age-appropriate services only after dedicated
readiness review.

Release gates: - Child-safeguarding policy and named responsible lead. -
Jurisdiction-specific legal review. - Appropriate age assurance and
consent design. - Professional eligibility for treating or supporting
minors. - Policies for guardian involvement and confidentiality, as
applicable. - Age-appropriate content and interface. - Restrictions on
adult-minor contact and private messaging. - Enhanced moderation and
escalation arrangements. - Tested abuse, exploitation, and crisis
workflows. - Privacy impact assessment and high-privacy defaults.

Teen access must remain disabled until these gates are explicitly
approved by the responsible team.

------------------------------------------------------------------------

## 4. Roles and permissions

Use least-privilege access. Roles must be enforced on the server and,
where supported, at the database layer.

### Member

Can: - Manage own profile and preferences. - Create and view own
check-ins and journal entries. - View approved resources and public
provider profiles. - Create and manage own bookings. - Participate in
permitted community groups. - Report content and block users. - Manage
consents and request account deletion.

Cannot: - View another member's private check-ins, journal,
appointments, or private conversations. - See internal provider
verification documents. - See private incident records. - Access admin
or moderator functions.

### Professional

Can: - Manage own professional profile after approval. - Submit and
update availability. - View bookings assigned to them. - Access only the
member information that the service explicitly permits and the member
has appropriately shared. - Manage appointment status and approved
operational notes. - Report incidents through the approved workflow.

Cannot: - Mark their own verification as approved. - Access unrelated
members or providers. - Browse private journals by default. - Export the
entire member database. - Claim service eligibility in jurisdictions
where it has not been approved.

### Peer listener

Can: - Manage approved listener availability and assigned
interactions. - Follow approved listening and signposting procedures. -
Report safeguarding concerns.

Cannot: - Present themselves as a clinical professional unless
separately verified and authorized. - Diagnose, prescribe, or promise
clinical treatment. - Access unrelated private member data.

### Moderator

Can: - Review reported community content. - Hide or remove content under
policy. - Apply documented restrictions. - Escalate safety incidents to
authorized staff.

Cannot: - Browse private journals or clinical records without a defined,
justified, audited process. - Access provider verification documents
unless separately authorized.

### Administrator

Can: - Manage accounts, approved resources, provider applications,
community operations, and platform configuration according to assigned
privileges. - View operational data needed to run the service. - Review
audit records and manage access.

Admin access must not mean unrestricted access to all private health
information. Sensitive incident and clinical information require
narrower permissions.

### Safeguarding or clinical lead

A separately assigned role for approved staff who need access to defined
incident or clinical workflows. Access must be documented, limited,
audited, and governed by policy.

------------------------------------------------------------------------

## 5. Main user journeys

### Member onboarding

1.  Member visits public landing page.
2.  Reviews the service's scope, free-access model, limitations, privacy
    summary, and safety information.
3.  Creates an account using the approved authentication method.
4.  Confirms required terms and relevant consent.
5.  Provides only necessary profile information, including country and
    language if required for service routing.
6.  Completes age eligibility flow.
7.  Selects optional support interests.
8.  Reaches the dashboard with clear choices: check in, explore
    resources, find a professional, or join an available peer-support
    space.

### Daily check-in

1.  Member opens the check-in.
2.  Selects a mood rating and optional energy or sleep information.
3.  Can skip any question.
4.  Optionally writes a private reflection.
5.  Receives a gentle, non-diagnostic response or a resource
    recommendation.
6.  Can save, edit, or delete the entry.
7.  Can view their own trends over time.

Check-ins must not imply that a score diagnoses depression or
establishes risk with clinical certainty.

### Professional booking

1.  Member browses approved profiles.
2.  Filters by service availability, specialty, language, session type,
    and eligible jurisdiction.
3.  Opens a provider profile with credentials and limitations clearly
    described.
4.  Chooses a genuinely available slot.
5.  Reviews session terms, privacy information, and cancellation policy.
6.  The server reserves the slot transactionally.
7.  Member and provider receive confirmations.
8.  Authorized participants receive secure session instructions.
9.  Completion or cancellation updates the appointment status.
10. Member may optionally provide feedback or book again.

### Volunteer onboarding

1.  Applicant creates a professional account.
2.  Submits identity and qualification information through a secure
    workflow.
3.  Platform reviews registration, references, service eligibility, and
    required checks.
4.  Applicant completes policy and safeguarding onboarding.
5.  Authorized reviewer approves, rejects, or requests more information.
6.  Only approved applicants can publish public availability.
7.  Provider manages slots and capacity.
8.  Provider can pause availability or withdraw from volunteering.

### Peer-support interaction

1.  Member reviews rules and limitations.
2.  Member joins an approved group or listener flow.
3.  Member posts using a permitted display name.
4.  Members can report, block, and leave.
5.  Moderators review reports according to published coverage.
6.  Serious concerns follow the documented escalation procedure.

### Crisis or immediate danger

-   Present location-appropriate emergency and crisis resources.
-   Clearly state whether any human service is monitored and its
    operating hours.
-   Encourage contacting local emergency services or a trusted person
    when there is immediate danger.
-   If the platform promises staffed crisis response, it must have
    trained personnel, reliable coverage, written protocols, and tested
    escalation.
-   Do not rely solely on AI classification or a notification that may
    go unread.
-   Restrict incident records and document actions according to policy
    and applicable law.
-   Do not promise confidentiality without explaining lawful and
    safeguarding exceptions.

------------------------------------------------------------------------

## 6. Functional requirements

### Public website

-   Explain the platform and who it serves.
-   Explain that professional sessions depend on volunteer availability.
-   Explain the difference between professionals, peer listeners, and
    AI.
-   Provide privacy, terms, community guidelines, and safety pages.
-   Provide a professional volunteer application entry point.
-   Be accessible, mobile-responsive, and usable with assistive
    technology.
-   Avoid claims of guaranteed recovery or immediate support.

### Authentication and account management

-   Secure sign-up, login, logout, and password reset.
-   Email verification or another suitable verification mechanism.
-   Server-side session validation.
-   Rate limiting and abuse protection.
-   Account deletion and consent management.
-   No passwords stored in plaintext.
-   Optional MFA for privileged accounts; strongly recommended for
    administrators.

### Member dashboard

-   Daily check-in entry point.
-   Resource recommendations.
-   Upcoming appointments and booking status.
-   Access to peer-support spaces where eligible.
-   Safety and support links.
-   Clear distinction between optional and required actions.
-   No shame-inducing streaks, red warning scores, or punitive progress
    mechanics.

### Check-ins and journal

-   Optional mood rating.
-   Optional energy, sleep, or stress fields.
-   Optional private reflection.
-   Edit and delete controls.
-   User-only access unless explicitly shared through a separate, clear
    consent flow.
-   Basic trend visualization only after enough data exists.
-   No diagnostic label inferred from a mood score.
-   Do not put sensitive free text in analytics or logs.

### Resource library

-   Content category, title, summary, language, intended audience,
    author/source, reviewer, review date, and version.
-   Content review by appropriately qualified people where the subject
    requires clinical expertise.
-   Accessible text and media.
-   Clear distinction between educational resources and clinical advice.
-   Content licensing recorded; do not copy third-party material without
    permission.
-   Translation review for meaning, culture, and safety.
-   Resource publication and retirement workflow.

### Professional directory

-   Only approved and currently eligible providers appear as verified.
-   Provider type and credentials are described accurately.
-   Specialty, language, session format, service jurisdiction,
    availability, and free-session conditions are shown.
-   Never display sensitive verification documents publicly.
-   Provide a way to report a profile or raise a concern.
-   Show when no suitable appointments are available.

### Scheduling

-   Store timestamps consistently, typically in UTC, and display local
    times appropriately.
-   Handle daylight-saving changes.
-   Use database transactions or equivalent atomic locking to prevent
    double-booking.
-   Enforce valid booking states.
-   Validate cancellation and rescheduling windows on the server.
-   Use idempotent handling for booking requests and notifications where
    practical.
-   Do not disclose one member's appointment details to another.
-   Track operational events without unnecessary clinical information.

Suggested appointment states: - `requested` - `confirmed` -
`cancelled_by_member` - `cancelled_by_provider` - `completed` -
`member_no_show` - `provider_no_show` - `needs_follow_up` (operational
status only, with clear meaning)

Use a controlled transition model. Do not allow arbitrary status changes
from the client.

### Community

-   Topic-based groups.
-   Posting and commenting.
-   Community guidelines accepted during onboarding.
-   Report and block actions.
-   Rate limiting, spam controls, and moderation queue.
-   Moderator actions and audit records.
-   No public access to private member profiles or check-in history.
-   No unreviewed direct messaging in the initial MVP.
-   Publish the moderation coverage and realistic response times.

### Notifications

-   Booking confirmations and reminders.
-   Account and security notifications.
-   Optional wellbeing reminders, off by default or explicitly chosen by
    the user.
-   No sensitive mental-health details in email subject lines, push
    notifications, or lock-screen previews.
-   Respect time zones and notification preferences.
-   Avoid repeated or coercive engagement prompts.

### Admin operations

-   Provider application queue.
-   Verification decision and reason.
-   Resource management.
-   Community reports and moderation actions.
-   Appointment operational overview.
-   Account restriction and appeal workflow.
-   Incident queue with narrowly scoped access.
-   Audit logs for privileged operations.
-   Aggregate metrics without exposing private journal text.
-   Separate permission tiers for routine administration and sensitive
    safeguarding access.

------------------------------------------------------------------------

## 7. Safety, privacy, and compliance requirements

This section is a product and engineering baseline, not a legal opinion
or clinical protocol. Obtain qualified advice before launch.

### Safeguarding

-   Initial live pilot is adults-only.
-   Minor access remains disabled until dedicated release approval.
-   Publish clear eligibility and service boundaries.
-   Define staff ownership and escalation responsibilities.
-   Verify professional qualifications and eligibility.
-   Train volunteers in boundaries, confidentiality, safeguarding, and
    referral procedures.
-   Establish report, suspension, appeal, and incident workflows.
-   Do not promise a response outside actual operating hours.

### Privacy

-   Collect the minimum information necessary for the feature.
-   Separate account data, private journals, community content,
    appointments, and restricted incident records.
-   Record consent with policy version, timestamp, purpose, and
    revocation where appropriate.
-   Give users clear controls for export or deletion where applicable.
-   Define retention periods and deletion behavior, including backups
    and legal exceptions.
-   Never sell personal health data.
-   Never use sensitive mental-health information for advertising
    targeting.
-   Review every analytics, email, video, storage, and AI vendor before
    sending data to it.
-   Assess data residency and cross-border transfer requirements.
-   Create a breach response plan and data protection impact assessment
    where appropriate.

### Security

-   Enforce authorization server-side and at database level.
-   Validate all inputs on the server.
-   Protect against injection, cross-site scripting, CSRF where
    relevant, broken access control, and abuse of endpoints.
-   Use secure cookies and suitable session settings.
-   Keep privileged keys server-only.
-   Apply rate limits to authentication, booking, posting, and report
    endpoints.
-   Use private storage by default.
-   Use short-lived signed URLs for private files.
-   Record security-relevant events without logging sensitive message or
    journal contents.
-   Keep dependencies updated and scan for known vulnerabilities.
-   Test backup restoration and incident response.
-   Separate development, staging, and production.

### Clinical and content safety

-   Use reviewed, evidence-informed resources.
-   Do not claim the platform provides a diagnosis unless a separately
    approved clinical service legally does so.
-   Do not recommend starting, stopping, or changing medication.
-   Do not use check-in scores as a standalone diagnostic or crisis
    assessment.
-   Do not present AI as a therapist.
-   Make limitations and referral options clear.
-   Review any proposed risk-detection or personalized clinical feature
    with qualified advisers before implementation.

### Jurisdiction review

Before professional services are enabled in a country, document: -
Provider licensing and scope-of-practice rules. - Rules for remote or
cross-border care. - Privacy and health-data requirements. - Age and
consent requirements. - Mandatory reporting and safeguarding duties. -
Consumer protection and service terms. - Data transfer and residency
requirements. - Emergency resource availability. - Insurance, liability,
and professional responsibility considerations.

------------------------------------------------------------------------

## 8. Technical architecture

### Architecture principle

Use a modular monolith. Avoid microservices until actual scale or
operational boundaries justify them.

### Recommended starting stack

-   **Frontend:** Next.js and TypeScript.
-   **UI:** Tailwind CSS and an accessible component system.
-   **Backend:** Next.js server-side routes/actions or a clearly
    separated application service.
-   **Database:** PostgreSQL.
-   **Managed backend option:** Supabase for PostgreSQL, authentication,
    and private storage, subject to security and contractual review.
-   **Authentication:** Managed auth with secure session handling.
-   **File storage:** Private object storage.
-   **Email:** Transactional email provider with appropriate privacy
    terms.
-   **Scheduling jobs:** A managed scheduler or queue for reminders and
    cleanup tasks.
-   **Video:** Integrate a reputable provider only after evaluating
    privacy, security, contracts, and jurisdiction needs.
-   **Hosting:** Managed hosting selected based on security, cost,
    regional availability, and data-processing terms.
-   **Monitoring:** Error reporting, uptime checks, security event
    logging, and backup monitoring.
-   **Testing:** Unit, integration, end-to-end, accessibility, and
    security tests appropriate to the feature.

The exact provider choices can change. Do not assume a vendor is
compliant merely because it advertises security features.

### Logical modules

1.  Identity and access.
2.  Member profile and preferences.
3.  Consent and privacy.
4.  Check-ins and private journal.
5.  Resource catalogue.
6.  Professional applications and verification.
7.  Availability and scheduling.
8.  Community and moderation.
9.  Notifications.
10. Safety incidents.
11. Administration and audit.
12. Optional AI gateway (future phase).

### Data model --- initial entities

The exact schema should be designed after repository inspection and
reviewed before production migration.

-   `profiles`
-   `consents`
-   `professional_applications`
-   `professional_credentials` (restricted access)
-   `professional_service_eligibility`
-   `professional_availability`
-   `appointments`
-   `check_ins`
-   `journal_entries`
-   `resources`
-   `resource_reviews`
-   `community_groups`
-   `community_memberships`
-   `community_posts`
-   `community_comments`
-   `user_blocks`
-   `content_reports`
-   `moderation_actions`
-   `safety_incidents` (highly restricted)
-   `notifications`
-   `audit_logs`

Use UUIDs or equivalent non-guessable identifiers where appropriate.
Define foreign keys, indexes, retention rules, and deletion behavior.
Avoid collecting date of birth if an age eligibility mechanism can meet
the requirement with less data, subject to legal review.

### Access-control expectations

-   Members can read and mutate only their own private records.
-   Approved professionals can access only assigned appointments and
    explicitly shared information.
-   Pending professionals cannot publish profiles or access member
    records.
-   Moderators can access reported content and necessary context, not
    all private health data.
-   Admins have role-limited access.
-   Sensitive incident access is separately authorized and audited.
-   Service-role credentials must never be used in client code.
-   Every new table containing personal data must have a documented
    access policy and tests.

### API and application patterns

-   Validate request bodies with a schema validation library.
-   Apply authentication and authorization to every protected operation.
-   Keep business rules on the server.
-   Return generic error messages where detailed responses could reveal
    sensitive information.
-   Make booking and other state-changing operations safe against
    duplicate requests.
-   Use transactions for related database changes.
-   Keep notifications asynchronous where practical.
-   Do not place secrets or private data in URLs.
-   Avoid exposing internal IDs or status details that enable
    enumeration.

### Environment variables

Create a documented `.env.example` containing names and safe
placeholders only. Actual secrets must remain outside source control.

Possible variables, depending on selected providers: -
`NEXT_PUBLIC_APP_URL` - `NEXT_PUBLIC_SUPABASE_URL` -
`NEXT_PUBLIC_SUPABASE_ANON_KEY` (only if using the relevant public
client pattern; still configure database policies correctly) -
`SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose to the browser) -
`EMAIL_PROVIDER_API_KEY` - `VIDEO_PROVIDER_API_KEY` -
`SCHEDULER_SECRET` - `AI_PROVIDER_API_KEY` (future phase only)

Do not add unused variables simply because they are listed here. Update
this section when actual integrations are chosen.

------------------------------------------------------------------------

## 9. UX and accessibility principles

### Design direction

-   Calm, warm, modern, and non-clinical without trivializing distress.
-   Use generous spacing, readable typography, restrained color, and
    clear hierarchy.
-   Do not use alarming colors for ordinary mood changes.
-   Use plain language, supportive microcopy, and respectful error
    messages.
-   Avoid guilt, shame, pressure, streaks, or competitive wellbeing
    scores.
-   Let users skip optional check-ins and exercises.
-   Provide clear exits from sensitive screens.
-   Make support and safety information easy to find.

### Accessibility

Target WCAG 2.2 AA where feasible and verify against the current
applicable standard: - Keyboard navigation. - Visible focus states. -
Screen-reader labels. - Sufficient contrast. - Scalable text and
responsive layouts. - Accessible forms and error summaries. - Captions
and transcripts for media where applicable. - Reduced-motion support. -
Avoid relying on color alone. - Clear time-zone and date presentation.

### Content principles

-   Empathetic, non-judgmental, and non-diagnostic.
-   Do not assume everyone has the same family, culture, beliefs, or
    support network.
-   Avoid promises such as "cure depression" or "feel better instantly."
-   Make the distinction between peer support and clinical care
    explicit.
-   Provide reviewed translations before offering safety-critical
    information in a new language.

------------------------------------------------------------------------

## 10. Metrics and evaluation

Measure access, usefulness, operational health, and safety---not raw
engagement alone.

### Product metrics

-   Successful completion of first meaningful support action.
-   Onboarding completion and abandonment.
-   Resource discovery and voluntary repeat use.
-   Check-in completion when users choose to check in.
-   Booking funnel completion.
-   Time to first available session.
-   Booking cancellation and no-show rates.
-   Percentage of requests that cannot be matched to available capacity.
-   User-reported helpfulness and ease of access.

### Volunteer operations

-   Number of approved, active providers by jurisdiction and specialty.
-   Published free slots and utilization.
-   Time to application review.
-   Provider retention and reasons for pausing.
-   Volunteer workload and supervision participation.
-   Unfilled requests and waiting time.

### Safety and trust

-   Report volume and response times.
-   Moderation backlog.
-   Appeals and account reinstatement.
-   Privacy or security incidents.
-   Unauthorized-access test results.
-   Completion of safeguarding training.
-   Resource review freshness.

Metrics should be aggregated and privacy-conscious. Avoid inferring
diagnoses or risk from usage data. Set targets after the pilot
establishes a reliable baseline.

------------------------------------------------------------------------

## 11. Testing strategy

### Unit tests

-   Validation and business rules.
-   Appointment state transitions.
-   Availability and booking rules.
-   Consent logic.
-   Permission helper functions.
-   Resource visibility.
-   Retention and deletion logic where testable.

### Integration tests

-   Database access policies.
-   Member isolation.
-   Provider access to assigned appointments only.
-   Admin and moderator permission boundaries.
-   Atomic slot reservation.
-   Notification job behavior.
-   Account deletion and consent revocation.

### End-to-end tests

-   Sign up, sign in, and account recovery.
-   Complete a check-in and verify privacy.
-   Browse providers and book a free session.
-   Attempt a duplicate booking.
-   Cancel and reschedule.
-   Submit a provider application and approve it through the authorized
    flow.
-   Report and moderate a community post.
-   Delete an account and verify expected downstream behavior.

### Security tests

-   Horizontal and vertical privilege escalation.
-   Direct-object reference attacks.
-   Unauthenticated access to private endpoints.
-   Rate-limit bypass.
-   Input validation and injection.
-   Exposure of secrets in client bundles and logs.
-   Storage URL access and expiration.
-   Session handling and CSRF protections where applicable.

### Safety scenario testing

Use synthetic scenarios and qualified review to test: - A member asks
for a therapist but none are available. - A member posts potentially
harmful advice. - A member reports harassment. - A member expresses
immediate danger. - A minor attempts to enter an adults-only service. -
A professional loses approval or pauses availability. - A volunteer
misses an appointment. - A user revokes consent or requests deletion.

Testing a scenario does not itself establish clinical validity. Record
limitations and have relevant protocols reviewed by qualified people.

------------------------------------------------------------------------

## 12. Deployment and operations

### Environments

-   **Local development:** Synthetic data only.
-   **Staging:** Separate credentials, isolated database, synthetic
    users, test email/video integrations.
-   **Production:** Restricted access, real secrets, backups,
    monitoring, documented release and rollback procedures.

### Release checklist

-   Type check, lint, tests, and production build pass.
-   Database migrations reviewed and reversible where possible.
-   Authorization and privacy tests pass.
-   No secrets are committed.
-   Logging is checked for sensitive data.
-   Error monitoring and uptime checks are configured.
-   Backups and restoration procedures are tested.
-   Policy and help pages match actual operations.
-   Staff and volunteer training is complete for enabled services.
-   Launch geography and age eligibility are enforced.
-   Incident contacts and escalation ownership are confirmed.

### Operational ownership

Assign named owners before launch for: - Product and engineering. -
Provider verification. - Community moderation. - Safeguarding and
incident response. - Privacy and security. - Clinical content review. -
Volunteer support. - User support and complaints.

A single person may initially hold multiple operational
responsibilities, but the responsibilities themselves must be explicit
and manageable.

------------------------------------------------------------------------

## 13. Risks and mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Insufficient volunteer capacity     Limited launch cohort, visible
                                      availability, waitlist, provider
                                      partnerships, honest capacity
                                      messaging

  Unverified or ineligible providers  Verification workflow, status
                                      enforcement, periodic rechecks,
                                      report mechanism

  Crisis response expectations exceed Clear scope and service hours,
  capacity                            local resource directory, no false
                                      claims of monitoring

  Harmful peer interactions           Moderation, reporting, blocking,
                                      rate limits, clear community rules

  Privacy breach                      Data minimization, least privilege,
                                      encryption, audit, testing,
                                      response plan

  Unsafe AI output                    Defer AI, bound its role, review
                                      vendors, evaluate safety, never
                                      rely on it as sole crisis responder

  Teen safeguarding failure           Adults-only pilot, disabled minor
                                      access, dedicated release gates

  Volunteer burnout                   Capacity limits, supervision, pause
                                      controls, manageable scheduling

  Scope creep                         Phase gates, explicit acceptance
                                      criteria, defer non-essential
                                      features

  Operating costs exceed funding      Managed services, budget
                                      monitoring, grants and
                                      partnerships, staged expansion

  Global service rules vary           Jurisdiction matrix, service
                                      eligibility controls, local legal
                                      and professional review
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 14. Initial MVP acceptance criteria

The MVP is ready for a controlled adult pilot only when all applicable
items below are verified:

-   [ ] Member can register, sign in, recover account access, and manage
    consent.
-   [ ] Member can complete an optional check-in and view only their own
    entries.
-   [ ] Private journal content, if enabled, is protected from other
    members, moderators, and ordinary administrators.
-   [ ] Reviewed resources are accessible without payment.
-   [ ] Only approved and eligible professionals appear as verified.
-   [ ] Members can see genuine free availability and book an available
    slot.
-   [ ] Concurrent booking attempts cannot double-book a slot.
-   [ ] Appointment notifications do not expose sensitive details.
-   [ ] Members can cancel or reschedule according to clear rules.
-   [ ] Peer-support content can be reported and moderated.
-   [ ] User blocks and moderation restrictions are enforced
    server-side.
-   [ ] Safety information is easy to find and accurate for the launch
    geography.
-   [ ] Published service hours and response expectations reflect actual
    staffing.
-   [ ] Provider verification and volunteer procedures are documented.
-   [ ] Privacy notice, terms, consent, retention, deletion, and
    incident policies are reviewed.
-   [ ] Access controls and database policies are tested.
-   [ ] No critical security issues remain open.
-   [ ] Monitoring, backups, restoration, and rollback procedures are in
    place.
-   [ ] Synthetic data is used in development and staging.
-   [ ] Teen access is disabled until its dedicated release gates are
    approved.
-   [ ] An operational owner is assigned for support, safeguarding, and
    incidents.

------------------------------------------------------------------------

## 15. Working with this file across phases

At the beginning of a new Claude session, use this file as the project
context and provide the specific task.

### Suggested prompt for a new task

> Read `project.md` completely before making changes. Inspect the
> current repository and determine the active phase. Follow the rules,
> architecture, safety, privacy, and scope defined in `project.md`. Do
> not assume the repository is empty. Summarize the current
> implementation, identify the smallest safe next task, and propose a
> plan before editing. Implement only the agreed task, run relevant
> tests, inspect the diff, and update documentation. At the end, report
> changed files, tests and actual results, remaining risks, and the next
> recommended task. Do not claim that security, clinical, legal, or
> safeguarding requirements have been approved unless there is explicit
> evidence.

### Suggested phase-specific prompts

**Phase 0 --- Discovery** \> Review `project.md` and help complete Phase
0. Identify decisions that require founder input or qualified
professional advice. Draft the user interview plan,
jurisdiction-selection checklist, initial risk register, and
service-readiness checklist. Do not implement features yet.

**Phase 1 --- Foundations** \> Review `project.md` and inspect the
existing repository. Implement only the next approved Phase 1 task.
Prioritize secure authentication, authorization, consent, member
privacy, and a maintainable foundation. Include tests and documentation.

**Phase 2 --- Professional support** \> Review `project.md`. Implement
the next Phase 2 task for professional applications, verification
status, provider discovery, availability, or bookings. Enforce
eligibility and authorization on the server. Include tests for
concurrent booking and unauthorized access.

**Phase 3 --- Peer support** \> Review `project.md`. Implement the next
approved community feature with reporting, blocking, moderation, and
server-enforced permissions. Do not enable unreviewed direct messaging.
Include abuse and access-control tests.

**Phase 4 --- Pilot readiness** \> Review `project.md`. Audit the
application against the MVP acceptance checklist. Do not mark an item
complete without test results or evidence. Identify blockers,
operational dependencies, and unresolved security or safeguarding risks.

**Phase 5 --- AI** \> Review `project.md`. Propose an optional, bounded
AI feature that does not diagnose, prescribe, or act as the sole crisis
responder. Assess privacy, vendor terms, data minimization, failure
modes, safety testing, and a non-AI fallback before implementation.

**Phase 6 --- Teenage access** \> Review `project.md`. Do not enable
minor access. Prepare a readiness assessment covering child
safeguarding, age assurance, consent, professional eligibility, privacy,
moderation, crisis handling, and jurisdiction-specific legal review.
Identify required approvals before any implementation is enabled in
production.

------------------------------------------------------------------------

## 16. Decisions that remain open

Do not silently assume these decisions have been finalized:

1.  Final product name, domain, and visual identity.
2.  Initial launch country or countries.
3.  Clinical and safeguarding advisers.
4.  Legal entity and operating organization.
5.  Professional categories permitted in each launch jurisdiction.
6.  Verification vendor and required background checks.
7.  Video and messaging provider.
8.  Volunteer supervision and incident-response coverage.
9.  Initial peer-support format and moderation hours.
10. Resource content sources, review process, and licensing.
11. Data residency, retention, and deletion schedule.
12. Whether private journaling is included in the first public MVP.
13. Funding source and initial operating budget.
14. Teenage service model and release approval.
15. AI provider and whether AI is needed at all after the pilot.

When one of these decisions blocks safe implementation, explain the
decision and propose options rather than guessing.

------------------------------------------------------------------------

## 17. Definition of success

Project Haven succeeds when people can reliably find appropriate
support, use practical resources, and feel respected and protected---not
simply when the platform launches or accumulates users.

The initial goal is a small, trustworthy, operationally sustainable
adult pilot. Prove that the core service works, learn from members and
volunteers, improve the safety and experience, and expand only when the
people and processes behind the software can support that expansion.

**Build the service people can safely rely on, not just the interface
they can click through.**
