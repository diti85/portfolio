# endritbasha.com

Personal portfolio. The design is called **Loom**: lacquer green, brass thread, Bodoni type.
Its thread motif is taken from the work itself, messages from many sources converging through
one service.

## What's on the page

The landing page is short: hero, an About intro, three Explore panels, and Contact. Work,
Experience and Projects each open as a full-screen **sheet** that grows out of its panel
(a clip-path reveal) and shrinks back into it on close. Sheets have their own tabs, a
scroll-progress line and a "Next" link, and they sync with the address bar: opening pushes
`#work`, Back closes it, and a shared link such as `/#experience` or `/#retention` opens straight
into it. Sheet content is code-split and loads on first open. See `src/components/Sheet.jsx`,
`SheetProvider.jsx` and `src/lib/sheets.js`.

- **Hero:** a WebGL2 "loom". 33 source threads converge through one hub (the ingestion service)
  and leave as two braided strands (the two sinks), with messages travelling along them. Holding
  the pointer over the hub backs up intake behind it (backpressure). No three.js; see
  `src/components/loom/loom.js`. It pauses while a sheet covers it.
- **About:** who, where and what: portrait, a short bio, now / before / studying, three
  "what I do" pillars that link into the sheets, and four numbers at a glance.
- **Explore:** three panels that widen on hover, each with a small live preview.
- **Work sheet:** GEICO, problem first, in three chapters: I Ingestion (scroll-driven model,
  `src/components/pipeline/sim.js`), II Observability (break a node in the lineage graph),
  III Retention (policy-based deletion model, `src/components/retention/sim.js`).
- **Experience sheet:** the career as threads on a time axis, toolkit, education and credentials,
  and the résumé download.
- **Projects sheet:** OneAMS, AIP, Young Men of Distinction, Sunrise Apartments and Basha
  Management, each tagged with a case-study drawer, then live client websites.
- **Contact:** split by intent: hiring on the left, projects and partnerships (form) on the right.
- **Extras:** ⌘K / Ctrl+K command menu, Lenis smooth scrolling, a pointer companion on fine
  pointers, Open Graph image, JSON-LD, sitemap. `prefers-reduced-motion` gets still frames and a
  plain fade for sheets.

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
