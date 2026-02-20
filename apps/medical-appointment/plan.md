# Medical Appointment Platform – Build Plan (English)

Goal: Build a NestJS app inside this monorepo for medical appointment booking (in-person and online) with payments, contracts, reporting, multi-language (FA/EN/AR/KU), and phone-first authentication.

## Repo Guardrails (must follow)
- Follow AGENTS.md: module triad (controller/service/module + dto), new path alias `@rahino/med`, use `bigint` ids, DTOs use class-validator + `@ApiProperty`, `JwtGuard`/`PermissionGuard` for admin, `OptionalJwtGuard` for public.
- ORM: Sequelize models live in `libs/localdatabase/src/models/med/` with `index.ts` exporting all; use `QueryOptionsBuilder` for filters; re-init builder per query.
- Jobs: BullMQ (`@nestjs/bullmq`), processors extend `WorkerHost`.
- SQL: append new migration file(s) under `apps/main/src/sql/` (Core/Ecommerce/BPMN pattern); no hardcoded PK; keep two blank lines after new statements.
- Imports: external first, then path aliases; single quotes; trailing commas; use provided path aliases.
- Core tables/permissions: follow existing patterns in `apps/main/src/sql/Core/Core-V1.sql` and `apps/main/src/sql/Core/Core-Permission.sql` for new tables and permission seeds. Reference static `role.static` field and existing static roles already inserted in `apps/main/src/sql/Core/Core-Data.sql`; add new permissions/roles by appending to these files (no rewrites).

## Monorepo Placement & Aliases
- App root: `apps/medical-appointment/src/`
  - Folders: `anonymous/`, `patient/`, `doctor/`, `admin/`, `shared/`, `job/`, `report/`, `config/`, `webhook/`.
- Path alias: add `@rahino/med` → `apps/medical-appointment/src` in tsconfig paths and nest-cli if needed.
- Swagger group base path: `/api/med`.

## Roles & Access
- Admin: manage doctors, contracts, tariffs, payouts, sponsorship slots, reports, permissions.
- Doctor: manage profile & verification docs, languages, working hours, service offerings (visit types/durations/prices), approve/decline/reschedule bookings, start online visits, view revenue dashboard.
- Patient: search doctors, view slots, book/reschedule/cancel, pay, join online visits (audio/video/text), view history, manage language, receive notifications.

## Business Features (end-to-end)
- Doctor onboarding: phone login, submit profile + credentials, admin verification flow, status gates for visibility.
- Search & discovery: specialty/location/insurance/price filters, AI doctor suggestion CTA, sponsor card injection.
- Slot & calendar: doctor defines shifts + exceptions/holidays; system generates availability and enforces capacity per day.
- Booking lifecycle: pending → soft-approved → confirmed → completed/cancelled/no-show; conflict checks; patient reschedule/cancel rules; reminders.
- Payments: Stripe/PayPal/Zarinpal via `@rahino/pay`; statuses pending/paid/failed/refund; split revenue by contract terms; refund handling and reconciliation jobs.
- Online visit: create session (Jitsi/Zoom/WebRTC adapter), generate join links, mark start/end, optional notes/prescription placeholder.
- Contracts & tariffs: admin sets revenue share, payout cycle, effective dates; default tariffs per service type/region/insurance.
- Notifications: SMS/email/push hooks; templates per language; reminder and post-visit survey; notification log.
- Reporting & dashboards: admin KPIs (bookings, revenue, cancellations, busiest hours), doctor dashboard (today/weekly bookings, ratings, comments), patient history export.
- Ads/Sponsor: single lightweight card on patient home; managed by admin with schedule/priority.
- Security & compliance: phone-first auth + optional 2FA, audit trail, rate limits, encrypted PII fields, GDPR-like data minimization.

## Data Model (Sequelize, bigint ids)
- `MedUserProfile`: userId FK (existing user), role (admin/doctor/patient), locale, phone, email?, twoFactorEnabled, notificationPrefs json.
- `MedDoctor`: id, userId, specialty, degrees, bio, languages array, verificationStatus (pending/verified/rejected), ratingAvg, ratingCount.
- `MedDoctorDocument`: id, doctorId, type (license/id/other), fileUrl, status, reviewedBy, reviewedAt, note.
- `MedClinicLocation`: id, doctorId, title, address, latitude, longitude, city, insuranceList json, isPrimary.
- `MedServiceOffering`: id, doctorId, visitType (in_person/online/audio/text), title, durationMinutes, price, currency, capacityPerDay, isActive.
- `MedWorkSchedule`: id, doctorId, weekday, shiftStart, shiftEnd, breakWindows json, visitDurationOverride?, maxPerSlot?, timezone.
- `MedScheduleException`: id, doctorId, date, reason, isClosed, customSlots json.
- `MedSlotCache`: id, doctorId, serviceId?, date, slots json (availability snapshot), version.
- `MedPatientProfile`: id, userId, insuranceNumber?, birthDate?, gender?, language, preferences json.
- `MedAppointment`: id, patientId, doctorId, serviceId, visitType, status (pending/soft_approved/confirmed/cancelled/completed/no_show), scheduledAt, scheduledEnd, clinicLocationId?, notes, createdBy, cancelReason?, rescheduleOf?, priceAtBooking, currency.
- `MedAppointmentAudit`: id, appointmentId, actorId, action (create/approve/confirm/cancel/reschedule/complete/no_show/refund_request), metadata json.
- `MedPayment`: id, appointmentId, amount, currency, gateway, status (pending/paid/failed/refunded), refCode, refundRef, paidAt, failureReason?, splitPlatformShare, splitDoctorShare.
- `MedRefund`: id, paymentId, amount, status (requested/processing/paid/rejected), requestedBy, reason, processedAt.
- `MedContract`: id, doctorId, revenueSharePercent, payoutCycle (weekly/monthly), effectiveFrom, effectiveTo, status.
- `MedTariff`: id, serviceType, region?, insurance?, defaultPrice, currency, isActive.
- `MedOnlineSession`: id, appointmentId, provider (jitsi/zoom/webrtc), joinUrl, startAt, endAt, recordingRef?, tokenPayload json.
- `MedNotificationLog`: id, userId, type (sms/email/push), templateKey, channel, payload json, status, sentAt, providerMessageId.
- `MedSponsorSlot`: id, title, imageUrl, linkUrl, priority, activeFrom, activeTo, isActive.
- `MedRating`: id, appointmentId, doctorId, patientId, score (1-5), comment, createdAt; derived aggregates update doctor stats.
- `MedCoupon` (phase 3): id, code, discountType (percent/fixed), amount, maxRedemption, perUserLimit, expiresAt, isActive.
- `MedWallet` (phase 3): id, userId, balance, currency; `MedWalletTransaction` with type (topup/debit/refund/bonus), ref.
- `MedAuditTrail`: id, actorId, entity, entityId, action, metadata json, createdAt.
- Enum tables (status lookups): create dedicated tables or lookup rows for `VisitType`, `AppointmentStatus`, `PaymentStatus`, `VerificationStatus`, `RefundStatus`, `NotificationType`, `Role`; populate via a new `Med-Data.sql` (see migration section). Each enum used in code must have corresponding seeded rows.

### Enums (shared)
- Role: admin | doctor | patient
- VisitType: in_person | online | audio | text
- AppointmentStatus: pending | soft_approved | confirmed | cancelled | completed | no_show
- PaymentStatus: pending | paid | failed | refunded
- VerificationStatus: pending | verified | rejected
- RefundStatus: requested | processing | paid | rejected
- NotificationType: sms | email | push

## Required SQL Migration
- Create a new migration file in `apps/main/src/sql/` (e.g., `Med-Table.sql` and `Med-Data.sql` if needed).
- Append tables above using bigint PK, FKs to existing user table, default timestamps, status enums as check/lookup tables if preferred.
- No hardcoded PK values; keep two blank lines after appended SQL per repo rule.
- For permissions/roles: append new permission rows to `Core-Permission.sql` and any new static roles (with `static` field) to `Core-Data.sql` following existing pattern; wire new permissions to roles. Ensure any new core tables follow conventions from `Core-V1.sql`.

## Modules & Responsibilities (controller/service/module/dto)
- `anonymous/auth`: send-otp, verify-otp, refresh; throttling; locale capture; OptionalJwtGuard for public endpoints.
- `anonymous/ai-suggest`: stub rules-based doctor suggestion; hook for ML later.
- `patient/doctors`: list/search doctors (filters via QueryOptionsBuilder), doctor detail, slots view; sponsor slot injection.
- `patient/appointments`: create booking, reschedule, cancel, view upcoming/past; validations against slots and conflicts; returns `{ result, total }` shape.
- `patient/payments`: start payment, confirm callback, request refund.
- `patient/online-session`: list/join sessions; view disclaimers.
- `patient/profile`: update contact info, language, notification prefs; history export.
- `doctor/dashboard`: today counts, pending approvals, ratings/comments feed.
- `doctor/appointments`: approve/decline/confirm/no-show, add offline booking, reschedule; soft-approve step matches “local culture” requirement.
- `doctor/schedule`: manage work schedule, exceptions, generate slot cache; capacity/day and duration overrides.
- `doctor/profile`: edit professional info, upload documents (minio-client), track verification status.
- `doctor/online-session`: start/end session, create join link via provider adapter, optional note entry.
- `admin/doctors`: verify/reject doctor documents, toggle visibility, force password/2FA requirements.
- `admin/contracts`: CRUD contracts, attach to doctor, set revenue share and payout cycle.
- `admin/tariffs`: CRUD tariffs and map to service offerings/region/insurance.
- `admin/payments`: payout overview, refund approvals.
- `admin/sponsor`: manage sponsor slots content and schedule.
- `report`: admin KPIs + exports; doctor personal report; patient history export.
- `job`: BullMQ processors for OTP, reminders, reconciliation, cleanup.
- `webhook/payments`: provider-specific callbacks; verify signatures; update payments/appointments.

## Shared Business Layer (`shared/`)
- Shared models: DTOs for common types (pagination/filter base), response transformer interceptor, exception filters, i18n helpers, guards (JwtGuard, OptionalJwtGuard, PermissionGuard wiring), decorators (`@GetUser`, locale extractor), pipes (ValidationPipe with transform=true).
- Shared services: notification sender (wraps `@rahino/sms` + email/push stub), payment adapter orchestrator (wrap `@rahino/pay`), slot generator service, time utilities (timezone/locale-aware), audit logger, file upload helper (wrap `@rahino/file` + `@rahino/minio-client`).
- Shared enums/interfaces: centralized export of VisitType, AppointmentStatus, PaymentStatus, VerificationStatus, RefundStatus, NotificationType, Role.
- Expose these via `@rahino/med/shared` barrel for reuse across modules.

## Background Jobs (BullMQ)
- OTP sender with rate limit per phone.
- Slot cache builder per doctor/day; trigger on schedule change.
- Reminder notifications (T-24h, T-2h) via SMS/email; follow-up survey invite.
- Payment reconciliation & webhook retry; refund processor.
- Cleanup: expire pending bookings after timeout; release slots; close stale online sessions.

## API Surface (path examples, group by area)
- Anonymous: `POST /api/med/auth/send-otp`, `POST /api/med/auth/verify-otp`, `POST /api/med/ai/suggest-doctor`.
- Patient: `GET /api/med/doctors`, `GET /api/med/doctors/:id`, `GET /api/med/doctors/:id/slots`, `POST /api/med/appointments`, `PATCH /api/med/appointments/:id/cancel`, `PATCH /api/med/appointments/:id/reschedule`, `GET /api/med/appointments/me`, `POST /api/med/payments/:id/confirm`, `GET /api/med/online-sessions`.
- Doctor: `GET /api/med/me/dashboard`, `PATCH /api/med/appointments/:id/approve`, `PATCH /api/med/appointments/:id/confirm`, `PATCH /api/med/appointments/:id/no-show`, `PATCH /api/med/appointments/:id/reschedule`, `POST /api/med/appointments/offline`, `GET /api/med/schedule`, `PUT /api/med/schedule`, `POST /api/med/schedule/exceptions`, `PUT /api/med/profile`, `POST /api/med/profile/documents`, `POST /api/med/online-sessions/:id/start`, `PATCH /api/med/online-sessions/:id/end`.
- Admin: `POST /api/med/doctors/:id/verify`, `POST /api/med/doctors/:id/reject`, `POST /api/med/contracts`, `PUT /api/med/contracts/:id`, `POST /api/med/tariffs`, `PUT /api/med/tariffs/:id`, `GET /api/med/reports/summary`, `POST /api/med/sponsor`, `PUT /api/med/sponsor/:id`, `GET /api/med/payments/payouts`, `POST /api/med/refunds/:id/approve`.
- Webhooks: `/api/med/payments/webhook/:provider`.

## DTO & Validation Rules
- Use `@ApiProperty` on all DTO properties; `@Type(() => Number)` for numerics; `IsOptional` on optional params; `IntersectionType` for filters (ListFilter + specific fields) per AGENTS.
- Example filter DTO for doctor search: specialty, city, insurance, priceMin/priceMax, visitType, ratingMin, availability date range.
- Appointment creation DTO: doctorId (bigint), serviceId, visitType, scheduledAt (ISO), clinicLocationId?, note?, couponCode? (phase3), consent flag.

## Payments & Revenue Split
- Payment flow: create payment intent via `@rahino/pay`; store pending; webhook confirms paid; update appointment to confirmed; compute platform/doctor share using contract; enqueue payout job.
- Refund: patient or admin triggers; mark refund requested; job processes via provider and updates Payment/Refund.

## Localization & Accessibility
- Default locale FA but all UI/API responses language-aware; store preferred language per user; headers can override.
- RTL/LTR handling in clients; date/time formatting per locale; audio-first online visit default, video optional.

## Security & Compliance
- JWT access + refresh; phone OTP login; optional 2FA for doctors/admin.
- Rate limiting for auth/search; audit trail via `MedAuditTrail` + `MedAppointmentAudit`.
- Encrypt sensitive PII fields at rest; ensure TLS; consider CSRF if session cookies introduced.

## Observability
- Use `@rahino/logger` with correlation id; structured logs.
- Health endpoint `/api/med/health` checks DB, Redis, queue, payment provider ping.
- Basic metrics counters; job metrics.

## Testing Strategy
- Unit: services (slot generator, payment adapter, booking rules), guards, DTO validation.
- Integration/E2E: booking happy path, cancel/refund, online session start stub; jest-e2e config under `apps/medical-appointment/test` similar to other apps; mock guards with `.overrideGuard`.
- Contract tests: payment webhooks per provider.

## Delivery Roadmap
1) Phase 1 (Weeks 1–4): scaffold app + alias; auth OTP; doctor profile CRUD; slot model; booking create/cancel; Stripe/Zarinpal happy-path payment; SMS notifications; minimal dashboards; Swagger.
2) Phase 2 (Weeks 5–7): advanced calendar (exceptions, capacity overrides), reports (admin/doctor), ratings/comments, sponsor slot management, refund flow.
3) Phase 3 (Weeks 8–10): online visit adapters (Jitsi/Zoom/WebRTC), visit notes, survey, wallet/coupon, AI suggestion hook, full multi-language content.
4) Phase 4 (Weeks 11–12): contracts/tariffs with revenue split + payouts, public API for mobile, enforce 2FA for doctors, performance & scalability tuning.

## Immediate Setup Tasks
- Add path alias `@rahino/med` in tsconfig and nest-cli.
- Scaffold module folders and base controller/service/module files for anonymous, patient, doctor, admin, shared, job, report, webhook.
- Define Sequelize models above in `libs/localdatabase/src/models/med/` with `index.ts` export and `AutoMap` decorators where mapping needed.
- Create new SQL migration file(s) under `apps/main/src/sql/` to create Med tables and any lookup enums; append at file end with two blank lines.
- Register BullMQ queues for notifications/reminders/reconciliation; add processors under `apps/medical-appointment/src/job/`.
- Add Swagger tags per module; wire i18n middleware under `shared`.
- Extend `.env.sample` with STRIPE, PAYPAL, ZARINPAL, SMS, JITSI/ZOOM keys.
