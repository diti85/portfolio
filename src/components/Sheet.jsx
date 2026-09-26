import { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import { sheets } from "../data/content";
import { useSheet } from "../lib/sheets";
import { lockScroll } from "../lib/scroll";

// Sections load the first time they're opened, so the landing page stays light.
const CONTENT = {
  work: lazy(() => import("./Work")),
  experience: lazy(() => import("./Experience")),
  projects: lazy(() => import("./Projects")),
};

const EASE = [0.22, 1, 0.36, 1];

// A rectangle on screen as a clip-path window onto the full-screen sheet.
const inset = (r) =>
  r
    ? `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`
    : "inset(46% 38% 46% 38%)";
const FULL = "inset(0px 0px 0px 0px)";

const reveal = {
  from: (r) => ({ clipPath: inset(r), opacity: r ? 1 : 0 }),
  open: { clipPath: FULL, opacity: 1, transition: { duration: 0.85, ease: EASE } },
  to: (r) => ({
    clipPath: inset(r),
    opacity: r ? 1 : 0,
    transition: { duration: 0.6, ease: EASE },
  }),
};
const fade = {
  from: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
  to: { opacity: 0, transition: { duration: 0.25 } },
};

function Shell({ id, rect }) {
  const { goTo, close } = useSheet();
  const reduced = useReducedMotion();
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const index = sheets.findIndex((s) => s.id === id);
  const next = sheets[(index + 1) % sheets.length];
  const Content = CONTENT[id];

  // Lock the page, hide it from assistive tech and focus, and restore on close.
  useEffect(() => {
    const previous = document.activeElement;
    const page = document.querySelectorAll("[data-page]");
    lockScroll(true);
    page.forEach((el) => (el.inert = true));
    scrollRef.current?.focus({ preventScroll: true });
    return () => {
      lockScroll(false);
      page.forEach((el) => (el.inert = false));
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      // A case study or the command menu inside the sheet closes first.
      if (document.querySelector("[data-nested-dialog]")) return;
      close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <motion.div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-label={sheets[index].title}
      tabIndex={-1}
      data-lenis-prevent
      data-sheet-scroll
      custom={rect}
      variants={reduced ? fade : reveal}
      initial="from"
      animate="open"
      exit="to"
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-lacquer outline-none"
    >
      <div className="sticky top-0 z-20 border-b border-bone/10 bg-lacquer/85 backdrop-blur-xl">
        <div className="frame flex h-16 items-center justify-between gap-4">
          <span className="display hidden text-lg sm:block">Endrit Basha</span>
          <nav
            aria-label="Sections"
            className="flex items-center gap-1 rounded-full border border-bone/10 p-1"
          >
            {sheets.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(s.id)}
                aria-current={s.id === id ? "page" : undefined}
                className={`relative rounded-full px-3 py-1.5 text-xs transition-colors sm:px-4 ${
                  s.id === id ? "text-lacquer" : "text-sage hover:text-bone"
                }`}
              >
                {s.id === id && (
                  <motion.span
                    layoutId="sheet-tab"
                    className="absolute inset-0 rounded-full bg-gilt"
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                )}
                <span className="relative">{s.tab}</span>
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={close}
            className="flex h-9 items-center gap-2 rounded-full border border-bone/15 px-3 text-xs text-bone transition-colors hover:border-brass/60 sm:px-4"
          >
            Close
            <kbd className="hidden font-sans text-2xs text-moss sm:inline">Esc</kbd>
          </button>
        </div>
        <motion.div
          className="absolute inset-x-0 -bottom-px h-px origin-left bg-brass/70"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      <AnimatePresence mode="wait" onExitComplete={() => scrollRef.current?.scrollTo({ top: 0 })}>
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.25, ease: EASE } }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
        >
          <Suspense fallback={<div className="h-[60vh]" />}>
            <Content />
          </Suspense>

          <div className="frame mt-24 pb-16 md:mt-32">
            <div className="flex flex-col gap-8 border-t border-bone/15 pt-8 sm:flex-row sm:items-end sm:justify-between">
              <button type="button" onClick={() => goTo(next.id)} className="group text-left">
                <span className="block text-xs text-moss">Next</span>
                <span className="display mt-2 block text-5xl leading-none transition-transform duration-700 ease-[var(--ease-silk)] group-hover:translate-x-2 md:text-7xl">
                  {next.title}
                </span>
              </button>
              <button
                type="button"
                onClick={close}
                className="thread-link self-start text-sm sm:self-auto"
              >
                Back to the overview
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function Sheet() {
  const { openId, rect } = useSheet();
  return (
    <AnimatePresence custom={rect}>
      {openId && <Shell key="sheet" id={openId} rect={rect} />}
    </AnimatePresence>
  );
}
