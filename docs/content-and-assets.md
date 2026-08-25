# Content and asset guide

## Editing portfolio content

Primary selected-project content lives in `data/portfolio.ts`. Each project contains:

- positioning and role;
- challenge, response, and outcome;
- disciplines and stack;
- architecture layers;
- engineering decisions;
- public evidence boundary;
- live and repository links.

To add a case study, add a typed entry to `projects`. The `/work/[slug]` route, sitemap, work index, and discipline views will use it automatically. Add a smaller `archiveEntries` record when the work does not yet justify a full study.

## Profile image

The active portrait is `public/me_photo.jpeg`. It is used on the homepage profile section, About page, and social metadata. Recommended replacement:

- portrait orientation, ideally 1600 × 2000 px or larger;
- WebP, AVIF, or high-quality JPEG;
- neutral or engineering-context background;
- enough space around the head and shoulders for responsive crops.

## Project images

Store project media under `public/images/projects/<slug>/` for new work. Existing legacy screenshots remain in `public/work/`.

- hero/interface image: 2400 × 1500 px, 8:5 ratio;
- supporting image: 1600 × 1200 px, 4:3 ratio;
- prefer WebP or AVIF;
- remove private user data, tokens, internal URLs, and confidential dashboards;
- use descriptive filenames such as `scara-hmi-trajectory-view.webp`.

## CAD and 3D

Store optimized models under `public/models/<project>/`.

- preferred format: binary GLB;
- apply mesh simplification and Draco or Meshopt compression where practical;
- remove hidden construction geometry and confidential part metadata;
- provide a static poster image for mobile and no-WebGL fallback;
- keep interactive hotspots in typed content rather than embedding unexplained labels in the model.

## Videos

Store short project clips under `public/videos/projects/<slug>/`.

- MP4/H.264 for broad compatibility, with WebM where useful;
- muted by default, no autoplay with sound;
- provide captions or a concise transcript;
- include a poster image;
- prefer short, task-focused demonstrations over cinematic reels.

## Resume

`/resume` is a print-friendly HTML résumé with a Save as PDF action. If an approved PDF becomes available, place it under `public/documents/resume/` and add a direct download link without removing the accessible HTML version.

## Environment and deployment

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin. The metadata, sitemap, and robots files use `https://adihnursyam.com` only as a fallback.

