# endritbasha.com

Personal portfolio. The design is called **Loom**: lacquer green, brass thread, Bodoni type.
Its thread motif is taken from the work itself, messages from many sources converging through
one service.

## What's on the page

- **Hero:** a WebGL2 "loom". 33 source threads converge through one hub (the ingestion service)
  and leave as two braided strands (the two sinks), with messages travelling along them. Holding
  the pointer over the hub backs up intake behind it (backpressure). No three.js; see
  `src/components/loom/loom.js`.
- **Systems:** a scroll-driven working model of the ingestion service (33 sources, adaptive
  batching, backpressure, delivery to Cosmos DB and Snowflake) on a 2D canvas
  (`src/components/pipeline/sim.js`), followed by an interactive lineage graph where you break a
  node and watch the health engine trace the impact downstream.
- **Projects:** OneAMS, AIP, Basha Management and a nonprofit site rescue, each with a case-study
  drawer, plus an archive of earlier work with hover previews.
- **Experience:** the career drawn as threads on a time axis, with a ledger of outcomes.
- **About, Contact:** portrait, capabilities, credentials, an EmailJS form and local time.
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
