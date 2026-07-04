# Ember Field Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the templated visuals of the existing Vite/React/Three.js portfolio with the custom "Ember Field" design system per `docs/superpowers/specs/2026-07-04-portfolio-redesign-design.md`, updating outdated copy along the way.

**Architecture:** Keep the existing skeleton (Vite + React 18 + Tailwind + framer-motion + @react-three/fiber, section components composed in `App.jsx`, `SectionWrapper` HOC). Introduce a new design-token layer (Tailwind colors + `styles.js` + rewritten `index.css`), a new `EmberFieldCanvas` particle scene that replaces all four template canvases, and rewrite each section component in place. Old template code and multi-MB assets are deleted in a final cleanup task so the build stays green after every task.

**Tech Stack:** Vite 4, React 18, Tailwind 3, framer-motion 10, @react-three/fiber 8, three 0.152, maath, @fontsource (Space Grotesk / Inter / JetBrains Mono), EmailJS, gh-pages.

## Global Constraints

- Palette tokens (exact): bg `#0a0a0b`, surface `#131316`, accent `#ff3b3b`, accent-deep `#7a1523`, heading `#f4f4f5`, body `#a1a1aa`. Accent is never used as a large fill.
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (labels), all self-hosted via @fontsource. No Google Fonts CDN.
- Shared easing for all framer transitions: `cubic-bezier(0.22, 1, 0.36, 1)` (exported as `EASE`).
- `prefers-reduced-motion` must stop canvas animation (freeze time uniform) and framer transitions (`MotionConfig reducedMotion="user"`).
- No `react-tilt`, no `react-vertical-timeline-component`, no GLTF models anywhere after Task 10.
- Draft resume content is marked with `// TODO(endrit): verify` comments in `src/constants/index.js`.
- Deploy flow (`npm run deploy`, gh-pages, CNAME `endritbasha.com`) must remain untouched.
- After every task: `npm run lint` passes with 0 warnings and `npm run build` succeeds.
- This project has no unit-test infrastructure; the test cycle for each task is lint + build + visual verification in the dev server. Do not add a test framework.

---

### Task 1: Design token foundation (fonts, Tailwind, CSS, styles, motion, meta)

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `tailwind.config.js`
- Modify: `src/index.css` (full rewrite)
- Modify: `src/styles.js` (full rewrite)
- Modify: `src/utils/motion.js` (full rewrite)
- Modify: `index.html`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind color classes `bg-bg`, `bg-surface`, `text-accent`, `text-heading`, `text-body`, `border-accent`, `from-accent`, etc.; font classes `font-display`, `font-mono` (Inter is the default `font-sans`); `styles` object with keys `paddingX`, `paddingY`, `padding`, `heroHeadText`, `heroSubText`, `sectionHeadText`, `sectionSubText`; motion exports `EASE` (array), `fadeUp(delay?: number)`, `staggerContainer(stagger?: number, delay?: number)`; CSS utility classes `.signal-dot` and `.hero-glow`.
- NOTE: old motion exports `textVariant`, `fadeIn`, `zoomIn`, `slideIn` are still imported by not-yet-rewritten components, so they are kept temporarily and deleted in Task 10.

- [ ] **Step 1: Install font packages**

```bash
cd /Users/endritbasha/Documents/Repos/portfolio
npm install @fontsource/space-grotesk @fontsource/inter @fontsource/jetbrains-mono
```

Expected: packages added to `dependencies`, install succeeds.

- [ ] **Step 2: Rewrite `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0b",
        surface: "#131316",
        accent: "#ff3b3b",
        "accent-deep": "#7a1523",
        heading: "#f4f4f5",
        body: "#a1a1aa",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
```

Note: the old tokens `primary`, `secondary`, `tertiary`, `black-100`, `black-200`, `white-100`, `boxShadow.card`, and `backgroundImage.hero-pattern` are intentionally dropped. Old components still referencing them (e.g. `bg-primary`, `text-secondary`) will render with missing colors until their rewrite task — this is acceptable; build and lint stay green.
EXCEPTION: `App.jsx` uses `bg-primary` on the root div and `bg-hero-pattern` on the hero wrapper. To keep the page background correct from this task onward, also apply the two-line App.jsx tweak in Step 6.

- [ ] **Step 3: Rewrite `src/index.css`**

```css
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/space-grotesk/500.css";
@import "@fontsource/space-grotesk/700.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  scroll-behavior: smooth;
  color-scheme: dark;
}

body {
  font-family: "Inter", system-ui, sans-serif;
  background-color: #0a0a0b;
  color: #a1a1aa;
}

::selection {
  background: rgba(255, 59, 59, 0.35);
  color: #f4f4f5;
}

.hash-span {
  margin-top: -100px;
  padding-bottom: 100px;
  display: block;
}

/* Signal-line motif: glowing dot used in eyebrows and timeline */
.signal-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #ff3b3b;
  box-shadow: 0 0 8px rgba(255, 59, 59, 0.9);
  vertical-align: middle;
  margin-right: 8px;
}

/* Static crimson glow behind the hero; also the WebGL-failure fallback */
.hero-glow {
  background:
    radial-gradient(ellipse 70% 55% at 50% 65%, rgba(122, 21, 35, 0.35) 0%, rgba(10, 10, 11, 0) 65%),
    #0a0a0b;
}
```

All template gradient classes (`black-gradient`, `violet-gradient`, `dark-red-gradient`, `green-pink-gradient`, `*-text-gradient`) and `.canvas-loader` are deleted. Old components referencing them lose those decorations until rewritten — acceptable.

- [ ] **Step 4: Rewrite `src/styles.js`**

```js
const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",

  heroHeadText:
    "font-display font-bold text-heading lg:text-[88px] sm:text-[64px] xs:text-[50px] text-[40px] lg:leading-[0.95] leading-[1.05] tracking-tight",
  heroSubText:
    "text-body lg:text-[22px] sm:text-[20px] xs:text-[18px] text-[16px] leading-relaxed max-w-2xl",

  sectionHeadText:
    "font-display font-bold text-heading md:text-[52px] sm:text-[42px] xs:text-[34px] text-[28px] tracking-tight",
  sectionSubText:
    "font-mono text-accent text-[13px] tracking-[0.2em] uppercase",
};

export { styles };
```

- [ ] **Step 5: Rewrite `src/utils/motion.js`**

New system at the top; legacy variants kept below (still imported by old components) and deleted in Task 10.

```js
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE },
  },
});

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/* ------------------------------------------------------------------ */
/* Legacy variants below — still used by components pending rewrite.  */
/* Deleted in the cleanup task.                                       */
/* ------------------------------------------------------------------ */

export const textVariant = (delay) => ({
  hidden: { y: -50, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", duration: 1.25, delay },
  },
});

export const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { type, delay, duration, ease: "easeOut" },
  },
});

export const slideIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: { type, delay, duration, ease: "easeOut" },
  },
});
```

(`zoomIn` is only used by the template canvases being deleted; drop it now if nothing imports it — check with `grep -r "zoomIn" src/` first. If `Works.jsx` or others import it, keep it in the legacy block until Task 10.)

- [ ] **Step 6: Update `index.html` meta and `App.jsx` background classes**

`index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Endrit Basha — Software Engineer</title>
    <meta
      name="description"
      content="Endrit Basha is a software engineer at GEICO building Go services and React applications. Portfolio, experience, and selected projects."
    />
    <meta property="og:title" content="Endrit Basha — Software Engineer" />
    <meta
      property="og:description"
      content="Software Engineer II at GEICO. Go services, React applications, cloud architecture."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://endritbasha.com" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

`App.jsx` — change only these two classNames (full rewrite happens in Task 9):
- `<div className="relative z-0 bg-primary">` → `<div className="relative z-0 bg-bg">`
- `<div className='bg-hero-pattern bg-cover bg-no-repeat bg-center '>` → `<div>`

- [ ] **Step 7: Verify lint + build**

```bash
npm run lint && npm run build
```

Expected: both pass. (Lint config only covers `src`; unknown Tailwind classes don't fail builds.)

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: Ember Field design tokens — palette, fonts, motion, meta"
```

---

### Task 2: EmberFieldCanvas particle scene

**Files:**
- Create: `src/components/canvas/EmberField.jsx`
- Modify: `src/components/canvas/index.js`
- Modify: `src/components/index.js`

**Interfaces:**
- Consumes: nothing from other tasks (three, @react-three/fiber already installed).
- Produces: `EmberFieldCanvas` React component, default-exported from `src/components/canvas/EmberField.jsx` and re-exported from `src/components/canvas/index.js` and `src/components/index.js`. Props: `{ density?: number (default 1), opacity?: number (default 1), interactive?: boolean (default true) }`. Renders a full-size absolutely-positioned canvas (`className="absolute inset-0"` behavior built in via wrapper div). Includes an internal error boundary: on any render/WebGL error it renders `null` (callers put `.hero-glow` behind it as the visible fallback).

- [ ] **Step 1: Create `src/components/canvas/EmberField.jsx`**

```jsx
/* eslint-disable react/no-unknown-property */
import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  varying float vIntensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec3 pos = position;
    float n = noise(pos.xz * 0.35 + uTime * 0.08);
    float n2 = noise(pos.xz * 0.12 - uTime * 0.05);
    pos.y += n * 1.1 + n2 * 2.2;

    float dMouse = distance(pos.xz, uMouse);
    float push = smoothstep(3.0, 0.0, dMouse);
    pos.y += push * 1.4;
    vec2 away = normalize(pos.xz - uMouse + vec2(0.0001));
    pos.xz += away * push * 0.9;

    vIntensity = clamp(pos.y * 0.22 + 0.2 + push * 0.8, 0.0, 1.0);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (1.6 + vIntensity * 2.6) * uPixelRatio * (18.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying float vIntensity;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    vec3 deep = vec3(0.478, 0.082, 0.137); /* #7a1523 */
    vec3 hot = vec3(1.0, 0.231, 0.231);    /* #ff3b3b */
    vec3 color = mix(deep, hot, vIntensity);
    float alpha = (0.2 + vIntensity * 0.8) * uOpacity * smoothstep(0.5, 0.15, d);
    gl_FragColor = vec4(color, alpha);
  }
`;

const FIELD_WIDTH = 44;
const FIELD_DEPTH = 24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Field = ({ density, opacity, interactive }) => {
  const materialRef = useRef();
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const reduced = useMemo(prefersReducedMotion, []);

  const positions = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const scale = density * (isMobile ? 0.5 : 1);
    const cols = Math.max(20, Math.round(110 * scale));
    const rows = Math.max(10, Math.round(55 * scale));
    const arr = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        arr[i] = (c / (cols - 1) - 0.5) * FIELD_WIDTH;
        arr[i + 1] = 0;
        arr[i + 2] = (r / (rows - 1) - 0.5) * FIELD_DEPTH;
        i += 3;
      }
    }
    return arr;
  }, [density]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uPixelRatio: {
        value: Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio : 1,
          2
        ),
      },
      uOpacity: { value: opacity },
    }),
    [opacity]
  );

  useEffect(() => {
    if (!interactive || reduced) return undefined;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [interactive, reduced]);

  useFrame((state, delta) => {
    if (reduced) return;
    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.uTime.value += delta;
      const targetX = mouse.current.x * (FIELD_WIDTH / 2) * 0.6;
      const targetZ = -mouse.current.y * (FIELD_DEPTH / 2) * 0.8;
      mat.uniforms.uMouse.value.lerp(
        new THREE.Vector2(
          interactive ? targetX : 999,
          interactive ? targetZ : 999
        ),
        0.06
      );
    }
    if (groupRef.current && interactive) {
      groupRef.current.rotation.y +=
        (mouse.current.x * 0.05 - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x +=
        (mouse.current.y * 0.03 - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

class CanvasBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

const EmberFieldCanvas = ({ density = 1, opacity = 1, interactive = true }) => (
  <div className="absolute inset-0">
    <CanvasBoundary>
      <Canvas
        camera={{ position: [0, 7, 14], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={prefersReducedMotion() ? "demand" : "always"}
      >
        <Field density={density} opacity={opacity} interactive={interactive} />
      </Canvas>
    </CanvasBoundary>
  </div>
);

export default EmberFieldCanvas;
```

- [ ] **Step 2: Export it**

`src/components/canvas/index.js`:

```js
import EarthCanvas from "./Earth";
import BallCanvas from "./Ball";
import ComputersCanvas from "./Computers";
import StarsCanvas from "./Stars";
import EmberFieldCanvas from "./EmberField";

export { EarthCanvas, BallCanvas, ComputersCanvas, StarsCanvas, EmberFieldCanvas };
```

(Check the actual current import style in that file first and match it; old exports stay until Task 10.)

`src/components/index.js`: add `EmberFieldCanvas` to the canvas import line and to the export block.

- [ ] **Step 3: Verify lint + build + visual smoke test**

```bash
npm run lint && npm run build
```

Expected: pass. Then start `npm run dev`, temporarily nothing new renders (not yet used) — that's fine; this step only proves the module compiles.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: EmberFieldCanvas particle scene with cursor interaction"
```

---

### Task 3: Hero rewrite

**Files:**
- Modify: `src/components/Hero.jsx` (full rewrite)

**Interfaces:**
- Consumes: `EmberFieldCanvas` from `./canvas` (Task 2); `styles` from `../styles` (Task 1); `fadeUp`, `staggerContainer` from `../utils/motion` (Task 1); `.hero-glow` CSS class (Task 1).
- Produces: `Hero` default export, section with `id="home"`. Buttons link to `#work` and `#contact` (anchor ids provided by SectionWrapper on those sections).

- [ ] **Step 1: Rewrite `src/components/Hero.jsx`**

```jsx
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeUp, staggerContainer } from "../utils/motion";
import { EmberFieldCanvas } from "./canvas";

const Hero = () => {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden hero-glow">
      <Suspense fallback={null}>
        <EmberFieldCanvas />
      </Suspense>

      <div
        className={`relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center ${styles.paddingX} pointer-events-none`}
      >
        <motion.div
          variants={staggerContainer(0.12, 0.2)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-5"
        >
          <motion.p variants={fadeUp()} className={styles.sectionSubText}>
            <span className="signal-dot" />
            Software Engineer II @ GEICO
          </motion.p>

          <motion.h1 variants={fadeUp()} className={styles.heroHeadText}>
            Endrit Basha<span className="text-accent">.</span>
          </motion.h1>

          <motion.p variants={fadeUp()} className={styles.heroSubText}>
            I build resilient Go services and polished React applications —
            engineering insurance products used by millions.
          </motion.p>

          <motion.div variants={fadeUp()} className="mt-4 flex gap-4 pointer-events-auto">
            <a
              href="#work"
              className="font-mono text-[14px] px-6 py-3 rounded-lg bg-accent/10 border border-accent/60 text-heading hover:bg-accent/20 transition-colors"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="font-mono text-[14px] px-6 py-3 rounded-lg border border-white/15 text-body hover:border-white/40 hover:text-heading transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 w-full flex justify-center z-10">
        <a href="#about" aria-label="Scroll to about section">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        </a>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Verify in dev server**

```bash
npm run dev
```

Open http://localhost:5173 — expect: crimson particle terrain drifting, particles part around cursor, name in Space Grotesk, mono eyebrow, two buttons. No PC model.

- [ ] **Step 3: Lint + build, then commit**

```bash
npm run lint && npm run build
git add -A && git commit -m "feat: Ember Field hero with updated role copy"
```

---

### Task 4: Navbar rewrite

**Files:**
- Modify: `src/components/Navbar.jsx` (full rewrite)

**Interfaces:**
- Consumes: `styles`, `navLinks` from `../constants` (unchanged shape: `{id, title}[]`), `EASE` from `../utils/motion`.
- Produces: `Navbar` default export. No longer imports `logo`, `menu`, `close` assets or `react-router-dom`.

- [ ] **Step 1: Rewrite `src/components/Navbar.jsx`**

```jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { EASE } from "../utils/motion";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-20 transition-colors duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="w-full flex items-center justify-between max-w-7xl mx-auto">
        <a
          href="#home"
          className="flex items-center gap-3"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <span className="font-mono text-[14px] font-medium text-accent border border-accent/50 rounded-md px-2 py-1 leading-none">
            EB
          </span>
          <span className="font-display text-heading text-[16px] font-medium hidden sm:block">
            Endrit Basha
          </span>
        </a>

        <ul className="list-none hidden sm:flex flex-row gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setActive(link.title)}
                className={`group relative font-mono text-[13px] uppercase tracking-[0.15em] transition-colors ${
                  active === link.title ? "text-heading" : "text-body"
                } hover:text-heading`}
              >
                {link.title}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                    active === link.title ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="sm:hidden flex flex-col justify-center gap-1.5 w-8 h-8 z-30"
        >
          <span
            className={`block h-px bg-heading transition-transform ${
              open ? "rotate-45 translate-y-[3.5px]" : ""
            }`}
          />
          <span
            className={`block h-px bg-heading transition-transform ${
              open ? "-rotate-45 -translate-y-[3.5px]" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="sm:hidden fixed inset-0 bg-bg/95 backdrop-blur-lg z-20 flex items-center justify-center"
            >
              <ul className="list-none flex flex-col items-center gap-8">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, ease: EASE }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={() => {
                        setActive(link.title);
                        setOpen(false);
                      }}
                      className="font-display text-heading text-[28px] font-medium"
                    >
                      {link.title}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
```

- [ ] **Step 2: Verify, lint + build, commit**

Dev server: nav transparent over hero, blurred/solid after scrolling; mobile (narrow window) hamburger opens full-screen overlay with staggered links.

```bash
npm run lint && npm run build
git add -A && git commit -m "feat: slim blur navbar with signal-line underlines"
```

Note: `App.jsx` still wraps everything in `BrowserRouter`; harmless for now — it is removed in Task 9.

---

### Task 5: Content rewrite (constants) + About section

**Files:**
- Modify: `src/constants/index.js` (full rewrite)
- Modify: `src/components/About.jsx` (full rewrite)
- Create: `src/components/SectionHeader.jsx`

**Interfaces:**
- Consumes: `styles`, `fadeUp`, `SectionWrapper` (existing HOC, unchanged).
- Produces:
  - `SectionHeader` default export, props `{ eyebrow: string, title: string }`.
  - `src/constants/index.js` exports: `navLinks` (unchanged shape), `technologies` (unchanged shape `{name, icon}[]`), `experiences` (`{title, company_name, icon, date, points: string[]}[]` — `iconBg` field dropped), `projects` (`{name, description, tags: {name: string}[], image, source_code_link}[]` — tag `color` field dropped). `services` export is REMOVED — About no longer uses it, nothing else imports it (verify with `grep -r "services" src/`).
- IMPORTANT: dropping tag `color` and `iconBg` is safe for the not-yet-rewritten `Works.jsx`/`Experience.jsx` (they read the fields; `undefined` degrades styling but doesn't crash). Both are rewritten in Tasks 6 and 8.

- [ ] **Step 1: Create `src/components/SectionHeader.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeUp } from "../utils/motion";

const SectionHeader = ({ eyebrow, title }) => (
  <motion.div variants={fadeUp()}>
    <p className={styles.sectionSubText}>
      <span className="signal-dot" />
      {eyebrow}
    </p>
    <h2 className={`${styles.sectionHeadText} mt-3`}>{title}</h2>
  </motion.div>
);

export default SectionHeader;
```

- [ ] **Step 2: Rewrite `src/constants/index.js`**

```js
import {
  javascript,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  docker,
  pbsc,
  ucf,
  java,
  spring,
  aws,
  mysql,
  ws,
  household,
  simbank,
  reactique,
  datenight,
  nptg,
  geico,
} from "../assets";

export const navLinks = [
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "contact", title: "Contact" },
];

const technologies = [
  { name: "Java", icon: java },
  { name: "JavaScript", icon: javascript },
  { name: "React", icon: reactjs },
  { name: "Spring", icon: spring },
  { name: "AWS", icon: aws },
  { name: "Node.js", icon: nodejs },
  { name: "Tailwind", icon: tailwind },
  { name: "Redux", icon: redux },
  { name: "MongoDB", icon: mongodb },
  { name: "MySQL", icon: mysql },
  { name: "Git", icon: git },
  { name: "Docker", icon: docker },
];

// TODO(endrit): verify all experience bullets below — drafted, not confirmed.
const experiences = [
  {
    title: "Software Engineer II",
    company_name: "GEICO",
    icon: geico,
    date: "Aug 2025 — Present",
    points: [
      "Design and ship Go microservices powering policy-servicing workflows.",
      "Lead feature development across backend services and React front ends.",
      "Mentor early-career engineers and help drive code review standards.",
    ],
  },
  {
    title: "Software Engineer I",
    company_name: "GEICO",
    icon: geico,
    date: "Mar 2024 — Aug 2025",
    points: [
      "Built full-stack features for insurance platform applications.",
      "Contributed to migrating legacy systems to cloud infrastructure.",
      "Improved reliability and observability of production services.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "Wizard Studios",
    icon: ws,
    date: "Jan 2021 — Jan 2023",
    points: [
      "Developed and delivered client web applications end to end.",
      "Worked directly with clients to scope features and iterate on designs.",
    ],
  },
  {
    title: "B.S. Computer Science",
    company_name: "University of Central Florida",
    icon: ucf,
    date: "Aug 2021 — Dec 2023",
    points: [],
  },
  {
    title: "A.A.",
    company_name: "Palm Beach State College",
    icon: pbsc,
    date: "Aug 2020 — May 2022",
    points: [],
  },
];

const projects = [
  {
    name: "Non Profit Tech Guide",
    description:
      "Capstone project where I led backend development, architecting a robust authentication system on AWS Cognito, Lambda, and SAM for secure, scalable authorization.",
    tags: [{ name: "aws" }, { name: "react" }, { name: "serverless" }],
    image: nptg,
    source_code_link: "https://github.com/diti85",
  },
  {
    name: "HouseHold",
    description:
      "Full-stack mobile and web app that improves productivity between roommates — create and manage households, events, tasks, and shared shopping lists.",
    tags: [
      { name: "react" },
      { name: "react-native" },
      { name: "aws" },
      { name: "graphql" },
    ],
    image: household,
    source_code_link: "https://github.com/carlos-jmh/large-project",
  },
  {
    name: "SimBank",
    description:
      "Java Spring Boot project with an MVC architecture — a full-stack personal project simulating an online banking application.",
    tags: [{ name: "java" }, { name: "jwt" }, { name: "postgresql" }],
    image: simbank,
    source_code_link: "https://github.com/diti85",
  },
  {
    name: "Date Night",
    description:
      "A personalized app that solves the 'what to eat' dilemma — create, edit, and filter date night ideas by category.",
    tags: [
      { name: "react" },
      { name: "node" },
      { name: "express" },
      { name: "mongodb" },
    ],
    image: datenight,
    source_code_link: "https://github.com/diti85",
  },
  {
    name: "Reactique",
    description:
      "A complete e-commerce application with auth, shopping cart, products, and categories — built with React, Express, and Redux.",
    tags: [{ name: "react" }, { name: "node" }, { name: "redux" }],
    image: reactique,
    source_code_link: "https://github.com/diti85",
  },
];

export { technologies, experiences, projects };
```

NOTE: removing the `services` export and the unused icon imports (`mobile`, `backend`, `web`, `css`, `html`, `figma`, `typescript`, `threejs`, `carrent`, `jobit`, `tripguide`) — verify nothing else imports them: `grep -rn "services\|carrent\|jobit\|tripguide" src/ --include="*.jsx" --include="*.js" | grep -v constants | grep -v assets`. `About.jsx` (rewritten this task) was the only `services` consumer.

- [ ] **Step 3: Rewrite `src/components/About.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const About = () => {
  return (
    <>
      <SectionHeader eyebrow="01 — About" title="Overview" />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        <motion.p
          variants={fadeUp(0.1)}
          className="lg:col-span-3 font-display text-heading text-[22px] sm:text-[28px] leading-snug font-medium"
        >
          I turn complex problems into reliable, elegant software — from Go
          services running at scale to interfaces people actually enjoy using.
        </motion.p>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.p variants={fadeUp(0.2)} className="text-body text-[15px] leading-relaxed">
            I&apos;m a software engineer at GEICO working across the stack:
            Go and Java services on the backend, React on the front end, and
            the cloud infrastructure in between. I care about clean
            architecture, fast feedback loops, and shipping things that hold
            up in production.
          </motion.p>

          <motion.div
            variants={fadeUp(0.3)}
            className="font-mono text-[13px] bg-surface border border-white/5 rounded-xl p-5 flex flex-col gap-2.5"
          >
            <p>
              <span className="text-accent">role</span>
              <span className="text-body"> — Software Engineer II @ GEICO</span>
            </p>
            <p>
              <span className="text-accent">focus</span>
              <span className="text-body"> — Go · distributed systems · React</span>
            </p>
            <p>
              <span className="text-accent">interests</span>
              <span className="text-body"> — cloud architecture · AI</span>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
```

- [ ] **Step 4: Verify, lint + build, commit**

Dev server: About shows editorial two-column layout, no service cards. Old Experience/Works sections still render (degraded styling on tags is expected until their tasks).

```bash
npm run lint && npm run build
git add -A && git commit -m "feat: editorial About section + updated resume content"
```

---

### Task 6: Experience custom timeline

**Files:**
- Modify: `src/components/Experience.jsx` (full rewrite)

**Interfaces:**
- Consumes: `experiences` from `../constants` (Task 5 shape: no `iconBg`), `SectionHeader` (Task 5), `fadeUp`, `EASE`, `SectionWrapper`.
- Produces: `Experience` default export. No longer imports `react-vertical-timeline-component` or its CSS (package uninstalled in Task 10).

- [ ] **Step 1: Rewrite `src/components/Experience.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import { experiences } from "../constants";
import { fadeUp, EASE } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const ExperienceCard = ({ experience, index }) => (
  <motion.div variants={fadeUp(index * 0.06)} className="relative pl-14 sm:pl-20 pb-14 last:pb-0">
    <span className="absolute left-[11px] top-1.5 w-[10px] h-[10px] rounded-full bg-accent shadow-[0_0_12px_rgba(255,59,59,0.8)]" />

    <div className="flex items-center gap-4">
      <span className="w-12 h-12 rounded-lg bg-surface border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={experience.icon}
          alt={experience.company_name}
          className="w-8 h-8 object-contain"
        />
      </span>
      <div>
        <p className="font-mono text-[12px] text-accent tracking-[0.15em] uppercase">
          {experience.date}
        </p>
        <h3 className="font-display text-heading text-[20px] sm:text-[24px] font-bold leading-tight mt-0.5">
          {experience.title}
        </h3>
        <p className="text-body text-[14px]">{experience.company_name}</p>
      </div>
    </div>

    {experience.points.length > 0 && (
      <ul className="mt-4 flex flex-col gap-2">
        {experience.points.map((point, i) => (
          <li
            key={`exp-${index}-point-${i}`}
            className="text-body text-[14px] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-px before:bg-accent/70"
          >
            {point}
          </li>
        ))}
      </ul>
    )}
  </motion.div>
);

const Experience = () => {
  return (
    <>
      <SectionHeader eyebrow="02 — Experience" title="Where I've been" />

      <div className="relative mt-14">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute left-[15px] top-1.5 bottom-6 w-px origin-top bg-gradient-to-b from-accent via-accent/40 to-transparent"
        />
        {experiences.map((experience, index) => (
          <ExperienceCard
            key={`experience-${index}`}
            experience={experience}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
```

NOTE: keep the SectionWrapper id `"work"` — check the current `Experience.jsx` before rewriting; in this template Experience uses id `"work"` (nav "Work" scrolls here). Match whatever id the current file uses so nav anchors keep working.

- [ ] **Step 2: Verify, lint + build, commit**

Dev server: crimson spine draws in on scroll, dots glow, mono dates, drafted bullets visible, education entries render without bullets.

```bash
npm run lint && npm run build
git add -A && git commit -m "feat: custom signal-line experience timeline"
```

---

### Task 7: Tech grid

**Files:**
- Modify: `src/components/Tech.jsx` (full rewrite)

**Interfaces:**
- Consumes: `technologies` from `../constants`, `fadeUp`, `SectionWrapper`, `SectionHeader`.
- Produces: `Tech` default export. No longer imports `BallCanvas`.

- [ ] **Step 1: Rewrite `src/components/Tech.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import { technologies } from "../constants";
import { fadeUp } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const Tech = () => {
  return (
    <>
      <SectionHeader eyebrow="03 — Stack" title="Tools I work with" />

      <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            variants={fadeUp(index * 0.04)}
            className="group flex flex-col items-center justify-center gap-3 bg-surface border border-white/5 hover:border-accent/40 rounded-xl py-6 transition-colors duration-300"
          >
            <img
              src={tech.icon}
              alt={tech.name}
              className="w-10 h-10 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-mono text-[11px] text-body group-hover:text-heading transition-colors">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
```

(Match the current file's SectionWrapper id — check before rewriting; if the current `Tech.jsx` uses `""` or no wrapper, keep it consistent with the current anchor behavior.)

- [ ] **Step 2: Verify, lint + build, commit**

```bash
npm run lint && npm run build
git add -A && git commit -m "feat: tech grid replaces 3D balls"
```

---

### Task 8: Works cards

**Files:**
- Modify: `src/components/Works.jsx` (full rewrite)

**Interfaces:**
- Consumes: `projects` from `../constants` (tags are `{name}` only), `github` from `../assets`, `fadeUp`, `SectionWrapper`, `SectionHeader`.
- Produces: `Works` default export. No longer imports `react-tilt`.

- [ ] **Step 1: Rewrite `src/components/Works.jsx`**

```jsx
import React from "react";
import { motion } from "framer-motion";
import { github } from "../assets";
import { projects } from "../constants";
import { fadeUp } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";

const ProjectCard = ({ project, index }) => (
  <motion.div
    variants={fadeUp(index * 0.08)}
    className="group bg-surface border border-white/5 hover:border-accent/50 rounded-2xl overflow-hidden w-full sm:w-[356px] transition-colors duration-300"
  >
    <div className="relative h-[190px] overflow-hidden">
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <a
        href={project.source_code_link}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.name} source code`}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-bg/80 backdrop-blur border border-white/10 hover:border-accent/60 flex items-center justify-center transition-colors"
      >
        <img src={github} alt="" className="w-[18px] h-[18px] object-contain" />
      </a>
    </div>

    <div className="p-5">
      <h3 className="font-display text-heading text-[20px] font-bold">
        {project.name}
      </h3>
      <p className="mt-2 text-body text-[14px] leading-relaxed">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag.name}
            className="font-mono text-[11px] text-accent/90 border border-accent/20 rounded-full px-2.5 py-1"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const Works = () => {
  return (
    <>
      <SectionHeader eyebrow="04 — Work" title="Selected projects" />

      <motion.p variants={fadeUp(0.1)} className="mt-4 text-body text-[15px] leading-relaxed max-w-3xl">
        A few things I&apos;ve built — capstone work, side projects, and
        experiments. Each links to the source.
      </motion.p>

      <div className="mt-12 flex flex-wrap gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
```

NOTE: check the current `Works.jsx` SectionWrapper id before rewriting and keep it the same (nav "Work" must keep scrolling to whichever section it points to today — Experience uses `"work"` in this template).

- [ ] **Step 2: Verify, lint + build, commit**

Dev server: cards on `surface`, borders ignite crimson on hover, images zoom slowly, mono tag chips, github button opens correct URL (Non Profit Tech Guide now `https://github.com/diti85`).

```bash
npm run lint && npm run build
git add -A && git commit -m "feat: restyled project cards, drop tilt, fix broken source link"
```

---

### Task 9: Contact + Footer + App composition

**Files:**
- Modify: `src/components/Contact.jsx` (full rewrite)
- Create: `src/components/Footer.jsx`
- Modify: `src/components/index.js`
- Modify: `src/App.jsx` (full rewrite)
- Modify: `src/main.jsx` (only if it imports anything removed — check; likely unchanged)

**Interfaces:**
- Consumes: `EmberFieldCanvas` (Task 2), `SectionHeader`, `fadeUp`, `SectionWrapper`, existing EmailJS credentials (service `service_vh8j5y8`, template `template_bpbn6p8`, key `zSKYmPunmMrSb9wIA` — keep verbatim).
- Produces: `Contact` default export (wrapped `SectionWrapper(Contact, "contact")`), `Footer` default export, `App` composing `Navbar/Hero/About/Experience/Tech/Works/Contact/Footer` inside `MotionConfig reducedMotion="user"`, with `BrowserRouter` and `react-router-dom` usage removed.

- [ ] **Step 1: Rewrite `src/components/Contact.jsx`**

Keep the exact EmailJS logic and credentials; replace `alert()` with inline status; drop `EarthCanvas`.

```jsx
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { fadeUp } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import SectionHeader from "./SectionHeader";
import { EmberFieldCanvas } from "./canvas";

const inputClasses =
  "bg-surface border border-white/10 focus:border-accent/70 py-3.5 px-5 text-heading placeholder:text-body/60 rounded-lg outline-none text-[15px] transition-colors";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | "sent" | "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .send(
        "service_vh8j5y8",
        "template_bpbn6p8",
        {
          from_name: form.name,
          to_name: "Endrit Basha",
          from_email: form.email,
          to_email: "bashaditi@gmail.com",
          message: form.message,
        },
        "zSKYmPunmMrSb9wIA"
      )
      .then(
        () => {
          setLoading(false);
          setStatus("sent");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setStatus("error");
        }
      );
  };

  return (
    <>
      {/* sparse, dimmed reuse of the hero ember system per spec */}
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
        <EmberFieldCanvas density={0.35} opacity={0.35} interactive={false} />
      </div>

      <SectionHeader eyebrow="05 — Contact" title="Get in touch" />

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          variants={fadeUp(0.1)}
          className="lg:col-span-3 flex flex-col gap-5"
        >
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] text-body uppercase tracking-[0.15em]">
              Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] text-body uppercase tracking-[0.15em]">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className={inputClasses}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[12px] text-body uppercase tracking-[0.15em]">
              Message
            </span>
            <textarea
              rows={6}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What's on your mind?"
              required
              className={inputClasses}
            />
          </label>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="font-mono text-[14px] px-7 py-3 rounded-lg bg-accent/10 border border-accent/60 text-heading hover:bg-accent/20 transition-colors disabled:opacity-50 w-fit"
            >
              {loading ? "Sending..." : "Send message"}
            </button>
            {status === "sent" && (
              <p className="font-mono text-[13px] text-accent">
                Thanks — I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="font-mono text-[13px] text-body">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </motion.form>

        <motion.div variants={fadeUp(0.2)} className="lg:col-span-2 flex flex-col gap-6">
          <p className="text-body text-[15px] leading-relaxed">
            Whether you have a role in mind, a project to collaborate on, or
            just want to talk engineering — my inbox is open.
          </p>
          <div className="font-mono text-[13px] bg-surface border border-white/5 rounded-xl p-5 flex flex-col gap-2.5">
            <p>
              <span className="text-accent">email</span>
              <span className="text-body"> — bashaditi@gmail.com</span>
            </p>
            <p>
              <span className="text-accent">github</span>
              <span className="text-body"> — github.com/diti85</span>
            </p>
            <p>
              <span className="text-accent">location</span>
              <span className="text-body"> — Florida, USA</span>
              {/* TODO(endrit): verify location */}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
```

- [ ] **Step 2: Create `src/components/Footer.jsx`**

```jsx
import React from "react";
import { styles } from "../styles";

const Footer = () => (
  <footer className="relative border-t border-white/5">
    <div
      className={`max-w-7xl mx-auto ${styles.paddingX} py-8 flex flex-col sm:flex-row items-center justify-between gap-4`}
    >
      <p className="font-mono text-[12px] text-body">
        © {new Date().getFullYear()} Endrit Basha
      </p>
      <div className="flex gap-6">
        <a
          href="https://github.com/diti85"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[12px] text-body hover:text-accent transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/endritbasha"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[12px] text-body hover:text-accent transition-colors"
        >
          {/* TODO(endrit): verify LinkedIn URL */}
          LinkedIn
        </a>
      </div>
      <p className="font-mono text-[12px] text-body">
        built with React + Three.js
      </p>
    </div>
  </footer>
);

export default Footer;
```

- [ ] **Step 3: Update `src/components/index.js`**

```js
import { EmberFieldCanvas } from "./canvas";
import Hero from "./Hero";
import Navbar from "./Navbar";
import About from "./About";
import Tech from "./Tech";
import Experience from "./Experience";
import Works from "./Works";
import Contact from "./Contact";
import Footer from "./Footer";

export {
  Hero,
  Navbar,
  About,
  Tech,
  Experience,
  Works,
  Contact,
  Footer,
  EmberFieldCanvas,
};
```

(The old canvas exports `EarthCanvas`, `BallCanvas`, `ComputersCanvas`, `StarsCanvas` are dropped here — nothing imports them anymore after this task. `src/components/canvas/index.js` still exports them; that file is trimmed in Task 10 when the canvas files are deleted.)

- [ ] **Step 4: Rewrite `src/App.jsx`**

```jsx
import { MotionConfig } from "framer-motion";

import {
  About,
  Contact,
  Experience,
  Footer,
  Hero,
  Navbar,
  Tech,
  Works,
} from "./components";

const App = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-0 bg-bg">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Tech />
        <Works />
        <Contact />
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default App;
```

(`BrowserRouter` removed; `Navbar` no longer uses `Link`. `react-router-dom` stays in package.json until Task 10.)

- [ ] **Step 5: Verify, lint + build, commit**

Dev server: contact form styled dark with crimson focus rings; submit shows inline status (test the error path by submitting with network offline if convenient — optional); footer renders; whole page composes without the stars/earth canvases.

```bash
npm run lint && npm run build
git add -A && git commit -m "feat: restyled contact with inline status, add footer, simplify App"
```

---

### Task 10: Cleanup — delete template code, models, unused assets, packages

**Files:**
- Delete: `src/components/canvas/Computers.jsx`, `src/components/canvas/Ball.jsx`, `src/components/canvas/Stars.jsx`, `src/components/canvas/Earth.jsx`, `src/components/Loader.jsx`
- Modify: `src/components/canvas/index.js`
- Delete: `public/desktop_pc/` (15MB), `public/planet/` (2.9MB)
- Delete unused images in `src/assets/` (list in Step 3)
- Modify: `src/assets/index.js`
- Modify: `src/utils/motion.js` (remove legacy variants)
- Modify: `package.json` (via npm uninstall)
- Modify: `README.md`

**Interfaces:**
- Consumes: everything rewritten in Tasks 1–9 (no remaining references to deleted modules).
- Produces: final clean tree. `src/components/canvas/index.js` exports only `EmberFieldCanvas`. `src/utils/motion.js` exports only `EASE`, `fadeUp`, `staggerContainer`.

- [ ] **Step 1: Confirm nothing references the deletions**

```bash
grep -rn "ComputersCanvas\|BallCanvas\|StarsCanvas\|EarthCanvas\|CanvasLoader\|react-tilt\|react-vertical-timeline-component\|textVariant\|fadeIn\|slideIn\|zoomIn" src/ --include="*.jsx" --include="*.js" | grep -v "utils/motion.js" | grep -v "canvas/index.js"
```

Expected: no output (except possibly the files being deleted themselves). If any component still imports one of these, fix that component first — do not delete while referenced.

- [ ] **Step 2: Delete template canvases and loader; trim canvas index**

```bash
git rm src/components/canvas/Computers.jsx src/components/canvas/Ball.jsx src/components/canvas/Stars.jsx src/components/canvas/Earth.jsx src/components/Loader.jsx
```

`src/components/canvas/index.js`:

```js
import EmberFieldCanvas from "./EmberField";

export { EmberFieldCanvas };
```

- [ ] **Step 3: Delete 3D models and unused images**

```bash
git rm -r public/desktop_pc public/planet
git rm "website screensholt.png"
cd src/assets
git rm backend.png creator.png mobile.png web.png carrent.png jobit.png tripguide.png \
  blackbg.png blackbg2.jpg blackbg3.jpg redbg.jpg redbg.png redbg2.jpg herobg.png \
  logo.png logo-black.svg logo-white.svg logo-color.svg menu.svg close.svg
git rm tech/css.png tech/html.png tech/figma.png tech/typescript.png tech/threejs.svg
git rm company/meta.png company/shopify.png company/starbucks.png company/tesla.png
cd ../..
```

CAUTION: before each `git rm`, confirm the file is truly unreferenced (`grep -rn "<basename>" src/ index.html`). Keep `logo.svg` in `src/assets` ONLY if something imports it — after Task 4 the navbar doesn't; `public/logo.svg` (favicon) is separate and must stay. Adjust the list to what grep proves is unused.

- [ ] **Step 4: Rewrite `src/assets/index.js` to only what remains**

```js
import github from "./github.png";
import docker from "./tech/docker.png";
import git from "./tech/git.png";
import javascript from "./tech/javascript.png";
import mongodb from "./tech/mongodb.png";
import nodejs from "./tech/nodejs.png";
import reactjs from "./tech/reactjs.png";
import redux from "./tech/redux.png";
import tailwind from "./tech/tailwind.png";
import java from "./tech/java.svg";
import spring from "./tech/spring.png";
import aws from "./tech/aws.png";
import mysql from "./tech/mysql.png";
import ws from "./company/ws.png";
import ucf from "./company/ucf.png";
import pbsc from "./company/pbsc.png";
import geico from "./geico.png";
import household from "./household.png";
import simbank from "./simbank.jpg";
import reactique from "./reactique.png";
import datenight from "./date-night-sc.png";
import nptg from "./nptg.png";

export {
  github,
  docker,
  git,
  javascript,
  mongodb,
  nodejs,
  reactjs,
  redux,
  tailwind,
  java,
  spring,
  aws,
  mysql,
  ws,
  ucf,
  pbsc,
  geico,
  household,
  simbank,
  reactique,
  datenight,
  nptg,
};
```

- [ ] **Step 5: Remove legacy motion variants**

Delete everything below the "Legacy variants" divider comment in `src/utils/motion.js`, leaving only `EASE`, `fadeUp`, `staggerContainer`.

- [ ] **Step 6: Uninstall dead packages**

```bash
npm uninstall react-tilt react-vertical-timeline-component react-router-dom
```

(`react-router-dom` was dropped from App in Task 9 — confirm with `grep -rn "react-router" src/` before uninstalling; if anything still uses it, fix first.)

- [ ] **Step 7: Update `README.md`**

```markdown
# endritbasha.com

Personal portfolio — custom "Ember Field" design: a crimson particle terrain
built with React Three Fiber over a dark editorial layout.

## Stack

- Vite + React
- Three.js via @react-three/fiber (custom GLSL point shader)
- Tailwind CSS
- Framer Motion
- EmailJS

## Develop

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy   # builds and publishes to GitHub Pages (endritbasha.com)
```
```

- [ ] **Step 8: Full verify + commit**

```bash
npm run lint && npm run build
du -sh dist
```

Expected: lint and build pass; `dist` is drastically smaller than before (previously dominated by 15MB desktop_pc + 2.9MB planet in public/ which were copied into dist).

```bash
git add -A && git commit -m "chore: remove template canvases, 18MB of models, unused assets and deps"
```

---

### Task 11: End-to-end visual verification

**Files:** none (verification only).

**Interfaces:**
- Consumes: the complete site from Tasks 1–10.
- Produces: verified deliverable + screenshots for the user.

- [ ] **Step 1: Run the app and verify every section at desktop width**

```bash
npm run dev
```

Using browser automation (claude-in-chrome) or manual screenshots at 1440px width, verify:
- Hero: particle field animates, parts around cursor, copy says "Software Engineer II @ GEICO", no PC model.
- Navbar: transparent at top, blurred+bordered after scroll, underline hover.
- About: two-column editorial, "currently" mono block.
- Experience: spine draws on scroll, all five entries, bullets on the three jobs.
- Tech: grid, hover glow.
- Works: five cards, hover ignites border, tag chips, github buttons.
- Contact: styled form, aside block; Footer renders.

- [ ] **Step 2: Verify mobile (390px)**

Resize to 390px: hamburger opens full-screen overlay; hero text fits; grids collapse (tech 3-col, cards full-width); timeline readable.

- [ ] **Step 3: Verify reduced motion and WebGL fallback**

- Emulate `prefers-reduced-motion: reduce` (Chrome DevTools Rendering tab): particles freeze, framer transitions are instant, page fully readable.
- The `.hero-glow` gradient is visible behind the canvas (fallback path if WebGL fails).

- [ ] **Step 4: Confirm console is clean**

No React warnings (key errors, unknown props) or Three.js errors in the browser console.

- [ ] **Step 5: Send screenshots to the user and stop**

Do NOT run `npm run deploy` — deployment is the user's call after they review the drafted resume bullets marked `TODO(endrit): verify`.
