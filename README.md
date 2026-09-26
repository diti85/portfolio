# endritbasha.com

Personal portfolio. The design is called **Loom**: lacquer green, brass thread, Bodoni type.
Its thread motif is taken from the work itself, messages from many sources converging through
one service.

## What's on the page

The page reads top to bottom as intro, professional work, career, independent work, contact.
Every section opens with the same running header (name on the left, what's inside on the right).

- **Hero:** a WebGL2 "loom". 33 source threads converge through one hub (the ingestion service)
  and leave as two braided strands (the two sinks), with messages travelling along them. Holding
  the pointer over the hub backs up intake behind it (backpressure). No three.js; see
  `src/components/loom/loom.js`. The line under the name states role and employer.
- **About:** who, where and what: portrait, a short bio, now / before / studying, three
  "what I do" pillars that link into the page, and four numbers at a glance.
- **Work:** GEICO, labelled as professional work, with context and a chapter index, then three
  chapters: I Ingestion (scroll-driven model, `src/components/pipeline/sim.js`), II Observability
  (break a node in the lineage graph), III Retention (policy-based deletion model,
  `src/components/retention/sim.js`), and a short "Also at GEICO" list.
- **Experience:** the career drawn as threads on a time axis, then toolkit, education and
  credentials, and the résumé download.
- **Projects:** OneAMS, AIP, Young Men of Distinction, Sunrise Apartments and Basha Management,
  each tagged and with a case-study drawer, then live client websites with hover previews.
- **Contact:** split by intent: hiring on the left, projects and partnerships (form) on the right.
- **Extras:** ⌘K / Ctrl+K command menu, Lenis smooth scrolling, a pointer companion on fine
  pointers, Open Graph image, JSON-LD, sitemap. `prefers-reduced-motion` gets still frames
  throughout.

All copy and figures live in `src/data/content.js`, sourced from the résumé. Keep them truthful.

## Stack

Vite 8, React 19, Tailwind CSS 4, Motion, Lenis, EmailJS. Fonts are self-hosted through
Fontsource (Bodoni Moda, Hanken Grotesk).

## Develop

```bash
npm install
npm run dev
npm run lint
```

Requires Node 20.19 or newer.

## Deploy

Pushing to `main` builds and publishes to GitHub Pages (endritbasha.com) through
`.github/workflows/deploy.yml`.
