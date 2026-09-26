# Portfolio Redesign: "Loom"

**Date:** 2026-09-25
**Replaces:** 2026-07-04 "Ember Field"
**Brief (from Endrit):** a full revamp for recruiters and business partners, "modern,
interesting, luxurious". It should have what impressive portfolio sites have, with interesting
visualizations and animations, and more current projects.

## Concept

The subject is a software engineer who loves building software that solves real problems. His
headline work at GEICO is an ingestion service: 33 enterprise
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

Revised 2026-09-26 after Endrit's feedback that the page jumped from his name straight into GEICO
internals. A research pass over portfolios such as Brittany Chiang's, Lee Robinson's and Emil
Kowalski's, plus recruiter eye-tracking and hiring-manager sources, found three things. Visitors
look for name, current title and employer first. Most attention goes to the first two screens.
Employer work and side projects are kept apart. The page now reads:

1. Hero: name, "Software engineer at GEICO.", the high-level tagline, the counter.
2. About: portrait, bio, now / before / studying, three "what I do" pillars that link into the
   page, four numbers at a glance, and résumé and contact buttons.
3. Work: context first ("Problems I solve at GEICO", role, dates, a no-GEICO-data note), a
   chapter index, then I Ingestion, II Observability, III Retention, and "Also at GEICO".
   Every chapter is told problem first: "The problem", then "What I built".
4. Experience: timeline, toolkit (where technology names live), education and credentials,
   and the résumé.
5. Projects: tagged features with case studies (problem, what I built, where it stands, stack),
   then client websites with a call to action for businesses.
6. Contact: hiring on one side, projects and partnerships on the other.

Every section opens with a running header: label on the left, contents on the right. Chapters
are numbered because they are read in order. Sections are not numbered.

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

## Positioning (2026-09-26)

Endrit is not a "data engineer". The through-line is building software that solves real
problems. The hero states it, the About pillars group the evidence by where the problems come
from (GEICO, his own products, businesses and nonprofits), and each GEICO chapter opens with
the problem. His GEICO team is now called Enterprise Data (formerly Data Engineering).

## Explore panels and sheets (2026-09-26)

Endrit didn't want visitors scrolling through Work to reach Experience. The page now ends its
scroll at Contact: after About, three Explore panels (Work at GEICO, Experience, Projects) widen
on hover and open their section as a full-screen sheet that grows out of the panel. Closing
(button, Esc, or Back) shrinks it back. Sheets carry tabs to switch sections, a progress line,
and a "Next" link. URLs stay shareable (`/#experience`, `/#retention`).
