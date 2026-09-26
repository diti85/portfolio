# Portfolio Redesign: "Loom"

**Date:** 2026-09-25
**Replaces:** 2026-07-04 "Ember Field"
**Brief (from Endrit):** a full revamp for recruiters and business partners, "modern,
interesting, luxurious". It should have what impressive portfolio sites have, with interesting
visualizations and animations, and more current projects.

## Concept

The subject is a data engineer whose headline work is an ingestion service: 33 enterprise
sources converge through one service into two stores, at more than 30M messages a day. The
visual language comes from that: **threads converging through a single eye and braiding out
again**. Luxury is expressed with materials rather than ornament: lacquer green, brass hairlines
and a high-contrast didone.

## Tokens

| Token | Hex | Role |
| --- | --- | --- |
| lacquer | `#0b1d18` | page |
| lacquer-deep | `#071310` | footer, image mats |
| felt | `#10271f` | raised surfaces |
| brass | `#c8a56a` | thread: lines, links, borders |
| gilt | `#ebd29f` | highlights, particles, primary buttons |
| bone | `#eee7d8` | headings |
| sage / moss | `#a9b3a8` / `#7f8f85` | body / secondary text |
| ok / warn / fail | `#8fd1b0` / `#f0a04b` / `#ee5a45` | visualization status only |

**Type:** Bodoni Moda (optical-size axis) for display and figures; Hanken Grotesk for text and
labels. No monospace, no all-caps labels, and no eyebrows above headings.

## Principles

1. Motion lives in the data. The page chrome is still. Animation belongs to the loom, the
   pipeline model, the lineage demo and the timeline draw-in, plus one orchestrated name reveal.
2. Honest numbers. Every figure comes from the résumé or a repository. Simulations are labelled
   as simulations; the hero counter says it runs at the documented average rate; the lineage
   node names are called out as illustrative.
3. Hairlines everywhere. Brass is used as 1px thread and never as a large fill (the one
   exception is the primary buttons).
4. Reduced motion gets meaningful still frames, not blank canvases.

## Sections

Hero (loom), Systems (pipeline scrollytelling and lineage demo), Projects (features with case
study drawer, and an archive), Experience (thread timeline, details and ledger), About, Contact,
Footer. The global ⌘K command menu and the pointer companion are available throughout.

## Project selection

Chosen from a survey of `~/Documents/Repos` on 2026-09-25, then revised with Endrit on
2026-09-26:

- OneAMS (`bms`): the flagship. Product screenshots are from its public marketing assets.
- AIP (`aip`): screenshot of the public landing page only, never of organization data.
- Young Men of Distinction (`ymod`): named with Endrit's go-ahead. The screenshot shows the
  programs section rather than the homepage hero, which is a group photo of minors.
- Sunrise Apartments (`sunrise-apartments`): live at sunriseprishtina.com.
- Basha Management (`basha-mgmt-co`): the live site.
- Client websites, replacing the old archive of university projects: La Fogata, La Bamba,
  Momentum Real Estate Group, DRSA and Marine Plumbing Co. Screenshots were taken from the live
  sites on 2026-09-26.
