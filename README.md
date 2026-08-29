# Adi Haditya Nursyam — Engineering Portfolio

[![CI](https://github.com/soezyxstt/port/actions/workflows/ci.yml/badge.svg)](https://github.com/soezyxstt/port/actions/workflows/ci.yml)

Recruitment-focused engineering portfolio covering software products, AI systems, robotics, control, embedded systems, and technical leadership.

**Live:** [adihnursyam.com](https://adihnursyam.com)

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4 with a custom editorial design system
- Framer Motion for selected interactions
- React Three Fiber for CAD and technical visualization

## Local development

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Validation

```bash
bun run lint
bun run build
```

GitHub Actions runs the same lint and production-build checks on pushes and pull requests to `main`.

## Content model

Selected projects, architecture layers, evidence boundaries, disciplines, and case-study decisions live in `data/portfolio.ts`. Adding an entry there feeds the work index, dynamic case-study route, and sitemap.

Supporting profile and role history lives in `data/about.json` and `data/experience.json`.

## Main routes

- `/` — homepage and systems-builder overview
- `/work` and `/work/[slug]` — selected work and case studies
- `/robotics` and `/software` — role-specific entry points
- `/leadership` and `/about` — leadership evidence and profile
- `/archive` — filterable project index
- `/resume` — print-friendly résumé
- `/contact` — professional contact paths

## Deployment

Copy `.env.example` for local configuration and set `NEXT_PUBLIC_SITE_URL` to the canonical public origin before deployment. It is used by metadata, sitemap, and robots configuration.

```bash
bun run build
bun run start
```

## Documentation

- `docs/portfolio-inventory.md` — project selection and evidence boundaries
- `docs/content-and-assets.md` — editing, media, CAD, video, and résumé guidance
- `docs/implementation-report.md` — architecture, design direction, known gaps, and next enhancements
