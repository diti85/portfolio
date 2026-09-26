import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { nav, profile } from "../data/content";
import { lockScroll, scrollToId, useActiveSection } from "../lib/scroll";

const EASE = [0.22, 1, 0.36, 1];
const ids = nav.map((n) => n.id);

export default function Nav({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,backdrop-filter] duration-500 ${
          scrolled || open ? "bg-lacquer/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="frame flex h-16 items-center justify-between gap-6">
          <a href="#top" onClick={go("top")} className="relative z-10 flex items-baseline gap-3">
            <span className="display text-lg tracking-normal">Endrit Basha</span>
            {/* once the hero is gone, keep who-and-where in view */}
            <span
              className={`hidden text-2xs text-moss transition-opacity duration-500 lg:inline ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            >
              Software engineer at GEICO
            </span>
          </a>

          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex items-center gap-8 text-xs">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={active === item.id ? "location" : undefined}
                    className={`relative py-2 transition-colors hover:text-bone ${
                      active === item.id ? "text-bone" : "text-sage"
                    }`}
                  >
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-bead"
                        className="absolute -left-3 top-1/2 size-1 -translate-y-1/2 rounded-full bg-gilt"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden h-9 items-center gap-2 rounded-full border border-bone/15 px-3 text-2xs text-sage transition-colors hover:border-brass/60 hover:text-bone sm:flex"
              aria-label="Open command menu"
            >
              <kbd className="font-sans">{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd className="font-sans">K</kbd>
            </button>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center rounded-full border border-brass/50 px-4 text-xs text-bone transition-colors hover:bg-gilt hover:text-lacquer sm:flex"
            >
              Résumé
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-9 items-center gap-2 rounded-full border border-bone/15 px-4 text-xs text-bone md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        <div className="relative h-px bg-bone/[0.06]">
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left bg-brass/70"
            style={{ scaleX: progress }}
          />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 top-[65px] bg-lacquer md:hidden"
          >
            <nav
              aria-label="Sections"
              className="frame flex h-full flex-col justify-between pb-10 pt-8"
            >
              <ul className="flex flex-col gap-1">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 + i * 0.06, ease: EASE }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      className="display block py-2 text-5xl"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 text-sm">
                <a href={`mailto:${profile.email}`} className="text-bone">
                  {profile.email}
                </a>
                <a href={profile.resume} target="_blank" rel="noreferrer">
                  Download résumé (PDF)
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
