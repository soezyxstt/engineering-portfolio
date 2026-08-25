# Portfolio source inventory

This document records the evidence used for the public portfolio refresh. It intentionally excludes secrets, private records, `.env` values, and unsupported performance or user metrics.

## Selection method

Projects were compared on technical depth, relevance to robotics or software roles, evidence of personal ownership, multidisciplinary scope, deployed or operational context, visual storytelling potential, and distinctiveness.

## Flagship projects

### Two-DOF SCARA Robot

- Source: `soezyxstt/scara-final-year-project`
- Evidence inspected: repository README, root structure, languages, package scripts, public deployment, and recent commit history.
- Verified scope: ESP32 firmware, Next.js HMI, shared telemetry, Python analysis, selected EXP-1 through EXP-5 data, PID, tracking differentiator, trapezoidal trajectory generation, and independently selectable inertia/Coriolis/gravity compensation.
- Portfolio rationale: strongest end-to-end connection across physical systems, embedded behavior, control, web software, and experiments.

### Zyx Academy

- Source: public product at `zyxacademy.com` and founder context supplied in the portfolio brief.
- Evidence boundary: the product repository and private metrics were not publicly available during this audit.
- Portfolio rationale: strongest evidence of founder-level product ownership and long-term connection between software, teaching, content operations, and service delivery.

### HMM ITB Platform

- Source: `soezyxstt/hmm-lms`
- Evidence inspected: README, application structure, Prisma, worker folder, dependency graph, scripts, tests, public deployment, and recent history.
- Verified scope: Next.js, Prisma, authentication, typed API tooling, object storage integration, rich content, PWA tooling, notifications, and testing.
- Portfolio rationale: strongest public software platform by breadth and operational context.

## Supporting projects

### FESS Monitoring & Digital Twin

- Source: `soezyxstt/fess-hmi`
- Verified evidence: Next.js, MQTT, React Three Fiber, charting, Drizzle, deployed interface.
- Positioning: mechatronic monitoring prototype; no unverified physical test metrics are claimed.

### IIoT Conveyor Interface

- Sources: `soezyxstt/iiot-conveyor-hmi` and the public broker companion.
- Verified evidence: MQTT, monitoring/control/diagnostic component structure, React Query, Zustand, validation, Drizzle, deployed interface.
- Positioning: hardware-to-web laboratory HMI.

### PEMIRA KM ITB Platform

- Source: public team repository `soezyxstt/web-pemira`.
- Verified evidence: official project README, Next.js, tRPC, Prisma, NextAuth, Docker configuration, Recharts.
- Attribution: presented as a team-delivered platform with Adi's Head of Information Technology role, not as solo work.

### IAM ITB Digital Platform

- Source: `soezyxstt/iam`.
- Verified evidence: Payload CMS, PostgreSQL/Turso migration work, R2-compatible storage, search/SEO plugins, Playwright and Vitest, recent moderation and content-authoring work.
- Positioning: a content and operations platform rather than only a brochure site.

## Archive-only projects

Gumelar, Sentuh Undang, Mechanical Festival, and Pamoka remain discoverable in the archive but do not receive deep case studies because the available public evidence is currently thinner or the work is less differentiated for the target engineering roles.

## Claims intentionally removed or softened

- No user counts, traffic figures, revenue, concurrency numbers, performance improvements, or team sizes are published without direct evidence.
- Project technology is described only where it is visible in a public repository or supplied context.
- Zyx architecture and private product metrics are not inferred.
- Organizational work is clearly identified as team work.

