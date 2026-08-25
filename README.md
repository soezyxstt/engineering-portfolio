# Adi Haditya Nursyam — Engineering Portfolio

A recruitment-focused portfolio for a multidisciplinary engineer working across robotics, control, embedded systems, software platforms, product development, and technical leadership.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4 plus a custom editorial design system
- Framer Motion for selected interactions
- React Three Fiber for the existing CAD viewer

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
```

The production build performs TypeScript validation and statically generates the selected project case studies.

## Content model

Selected projects, architecture layers, evidence boundaries, disciplines, and case-study decisions live in `data/portfolio.ts`. Adding an entry there automatically feeds the work index, dynamic case-study route, and sitemap.

Supporting profile and role history remains in `data/about.json` and `data/experience.json`.

## Main routes

- `/` — homepage and systems-builder overview
- `/work` and `/work/[slug]` — selected work and case studies
- `/robotics` and `/software` — role-specific entry points
- `/leadership` and `/about` — leadership evidence and profile
- `/archive` — filterable project index
- `/resume` — print-friendly résumé
- `/contact` — professional contact paths

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the canonical public origin before deploying. It is used by metadata, the generated sitemap, and robots configuration.

Deploy with any Next.js-compatible host using:

```bash
npm run build
npm start
```

## Documentation

- `docs/portfolio-inventory.md` — project selection and evidence boundaries
- `docs/content-and-assets.md` — editing, media, CAD, video, and résumé guidance
- `docs/implementation-report.md` — architecture, design direction, known gaps, and next enhancements
