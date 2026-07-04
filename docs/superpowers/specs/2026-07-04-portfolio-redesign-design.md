# Portfolio Redesign — "Ember Field"

**Date:** 2026-07-04
**Status:** Approved
**Scope:** Keep the existing Vite + React + Three.js skeleton and section order; replace the templated visuals with a custom, art-directed design. Update outdated copy and draft experience bullets for user review.

## Goals

- The site should no longer be recognizable as the JavaScript Mastery portfolio template.
- Reflect current career status: Software Engineer II at GEICO (not "CS student").
- Load faster than the current site (drop the multi-MB GLTF PC model and 3D tech balls).
- One coherent visual system: black/crimson, signal-line motif, calm consistent motion.

## Visual System

### Palette

| Token | Value | Use |
|---|---|---|
| `bg` | `#0a0a0b` | Page background (near-black, not pure black) |
| `surface` | `#131316` | Cards, nav when solid |
| `accent` | `#ff3b3b` | Emphasis only: links, glows, signal lines |
| `accent-deep` | `#7a1523` | Gradient partner for accent |
| `text-heading` | `#f4f4f5` | Headings |
| `text-body` | `#a1a1aa` | Body copy |

The old pinkish grays (`#c3a6a6`, `#ffd9d9`) are removed. Accent is disciplined — never used for large fills.

### Typography

- **Display:** Space Grotesk — headings, hero name. Tight letter-spacing, huge scale. (Chosen over Clash Display because it is available on @fontsource for self-hosting.)
- **Body:** Inter.
- **Mono:** JetBrains Mono — section eyebrows (`01 — ABOUT`), tags, dates, labels.
- All self-hosted via `@fontsource` (no CDN layout shift).
- Design relies on scale contrast: huge display headings against small mono labels.

### Signal-line motif

The site's signature, evolved from the existing hero red dot + line: a thin crimson line with glowing dot endpoints that

- draws itself on scroll between section headers,
- forms the Experience timeline spine,
- underlines nav links and hovered project cards.

One motif repeated everywhere; no other decorative elements.

### Motion language

- Scroll-enter: soft fade-up + 8px rise, staggered children, one shared cubic-bezier.
- Hover: card border ignites crimson, content lifts 2px. No 3D tilt (remove `react-tilt`).
- `prefers-reduced-motion`: canvas animation stops, framer transitions become instant.

## Hero — Ember Field

Replace `ComputersCanvas` with `EmberFieldCanvas`:

- ~6–8k points on a displaced plane; gentle noise-driven drift (use existing `maath` dep).
- Crimson color ramp fading with depth; points near cursor push aside and brighten.
- Slight camera parallax toward cursor.
- Mobile (<768px): particle count halved. Reduced motion: static frame. Canvas lazy-mounted.

Overlay: mono eyebrow "Software Engineer II @ GEICO", huge display-type name, one-line positioning statement, two buttons (View Work / Contact). Keep a scroll indicator, restyled minimal.

## Sections

### Navbar
Slim, translucent + backdrop blur; solid after scrolling past hero. "EB" mono logo in a crimson-bordered square. Signal-line underline on hover/active. Mobile: full-screen overlay with staggered link reveal.

### About
Remove the four service cards (template filler). Two-column editorial layout: pull-quote intro left; supporting paragraph + mono "currently" block (role, location, focus) right. Signal line runs from eyebrow toward next section.

### Experience
Remove `react-vertical-timeline-component`. Custom timeline: signal line as spine, mono dates, company logos in small bordered squares, scroll-animated line/dots. Drafted bullets marked `// TODO: verify` in code for user correction:

- **GEICO — SWE II (Aug 2025–present):** feature leadership, Go services, mentoring.
- **GEICO — SWE I (Mar 2024–Aug 2025):** full-stack insurance platform work, cloud migration.
- **Wizard Studios (Jan 2021–Jan 2023):** client web applications.
- Education entries (UCF, PBSC) unchanged.

### Tech
Remove 3D balls (`Ball.jsx`). Clean grid: icon + mono label, crimson glow on hover, staggered reveal.

### Works
Keep all five projects. Cards: `surface` background, 1px border igniting crimson on hover, slow image zoom on hover, mono tag chips (replace rainbow gradient tags), GitHub icon button. Fix broken link on Non Profit Tech Guide (`github.com/diti85` → proper URL).

### Contact
Keep EmailJS form; restyle inputs (dark surface, crimson focus ring). Replace `StarsCanvas` with sparse dimmed ember particles (same system as hero). Add footer: name, GitHub/LinkedIn, "built with React + Three.js".

## Content updates

- Hero/About copy: Software Engineer II at GEICO; full-stack + Go; interests in cloud and AI. No "CS student" anywhere.
- Meta: real `<title>` ("Endrit Basha — Software Engineer"), description, OG tags (current title is Vite default).

## Technical

- **Keep:** Vite, React 18, Tailwind, framer-motion, @react-three/fiber, @react-three/drei, maath, EmailJS, gh-pages deploy, CNAME (endritbasha.com).
- **Remove:** `react-tilt`, `react-vertical-timeline-component`, `Computers.jsx`, `Ball.jsx`, `Stars.jsx`, GLTF PC model in `public/`, unused background jpgs/pngs in assets (~1MB+).
- **Add:** `@fontsource` packages for the three typefaces.
- **Perf:** hero canvas lazy-mounted; particle count responsive; reduced-motion support; expect large payload reduction vs. current GLTF-based hero.

## Error handling

- Canvas: wrap in an error boundary; on WebGL failure render the static gradient fallback so the hero is always readable.
- EmailJS: keep existing success/failure alerts, restyled inline (not `alert()`).

## Testing / verification

- `npm run build` and `npm run lint` pass clean.
- Visual verification of every section at mobile (390px) and desktop (1440px) widths via dev server.
- Verify reduced-motion behavior and WebGL fallback.
- Deploy flow (`npm run deploy`) untouched; CNAME preserved.
