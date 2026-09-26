import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { clientSites, projects } from "../data/content";
import { lockScroll } from "../lib/scroll";
import { goTo } from "../lib/sheets";
import { useMediaQuery } from "../lib/useInView";

const EASE = [0.22, 1, 0.36, 1];

function ExternalGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden="true">
      <path d="M3.5 2.5h6v6M9.5 2.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function Frame({ project }) {
  return (
    <div className="border border-brass/25 bg-lacquer-deep p-2 sm:p-3">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-[var(--ease-silk)] group-hover:scale-[1.035]"
        />
      </div>
    </div>
  );
}

function Feature({ project, onOpen }) {
  return (
    <article className="group grid gap-8 border-t border-bone/10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
      <div className="flex flex-col lg:col-span-5">
        <p className="text-xs text-moss">
          <span className="mr-3 inline-flex rounded-full border border-brass/40 px-2.5 py-0.5 text-2xs text-gilt">
            {project.tag}
          </span>
          <span className="figures">{project.years}</span>
          <span className="mx-2 text-bone/20">/</span>
          {project.role}
        </p>
        <h3 className="display mt-4 text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]">
          {project.name}
        </h3>
        {project.fullName && <p className="mt-2 text-sm text-moss">{project.fullName}</p>}
        <p className="mt-6 max-w-[44ch] text-base text-bone/85 md:text-lg">{project.summary}</p>

        {project.facts.length > 0 && (
          <dl className="mt-8 grid grid-cols-3 gap-4">
            {project.facts.map((f) => (
              <div key={f.label} className="border-t border-brass/30 pt-3">
                <dd className="display figures text-2xl text-bone md:text-3xl">{f.value}</dd>
                <dt className="mt-1 text-2xs leading-snug text-moss">{f.label}</dt>
              </div>
            ))}
          </dl>
        )}

        <p className="mt-8 text-xs leading-relaxed text-moss">{project.stack.join(", ")}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-auto lg:pt-10">
          <button
            type="button"
            onClick={() => onOpen(project)}
            data-cursor="Read"
            className="h-10 rounded-full border border-brass/50 px-5 text-sm text-bone transition-colors hover:bg-gilt hover:text-lacquer"
          >
            Read the case study
          </button>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="thread-link inline-flex items-center gap-1.5 text-sm"
            >
              {project.urlLabel}
              <ExternalGlyph />
            </a>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(project)}
        data-cursor="Open"
        aria-label={`Open the ${project.name} case study`}
        className="block text-left lg:col-span-7"
      >
        <Frame project={project} />
      </button>
    </article>
  );
}

function CaseStudy({ project, onClose }) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll("a[href], button:not([disabled])");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <button
        type="button"
        aria-label="Close case study"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-lacquer-deep/70 backdrop-blur-sm"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        data-nested-dialog
        data-lenis-prevent
        initial={{ x: "8%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "6%", opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative h-full w-full max-w-3xl overflow-y-auto border-l border-brass/20 bg-lacquer"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-bone/10 bg-lacquer/90 px-6 py-4 backdrop-blur md:px-12">
          <p className="text-xs text-moss">Case study</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="h-9 rounded-full border border-bone/15 px-4 text-xs text-bone transition-colors hover:border-brass/60"
          >
            Close
          </button>
        </div>

        <div className="px-6 pb-20 pt-10 md:px-12">
          <p className="text-xs text-moss">
            <span className="mr-3 inline-flex rounded-full border border-brass/40 px-2.5 py-0.5 text-2xs text-gilt">
              {project.tag}
            </span>
            <span className="figures">{project.years}</span>
            <span className="mx-2 text-bone/20">/</span>
            {project.role}
          </p>
          <h2 id="case-title" className="display mt-3 text-5xl leading-none md:text-6xl">
            {project.name}
          </h2>
          {project.fullName && <p className="mt-2 text-sm text-moss">{project.fullName}</p>}
          <p className="mt-6 text-lg text-bone/90">{project.summary}</p>

          <div className="mt-10">
            <Frame project={project} />
          </div>

          <h3 className="display mt-14 text-2xl">The problem</h3>
          <p className="mt-4 max-w-[62ch] text-base">{project.story.problem}</p>

          <h3 className="display mt-12 text-2xl">What I built</h3>
          <ul className="mt-5 flex flex-col gap-4">
            {project.story.built.map((b) => (
              <li key={b} className="relative max-w-[62ch] pl-6 text-base">
                <span
                  className="absolute left-0 top-[0.8em] h-px w-3 bg-brass"
                  aria-hidden="true"
                />
                {b}
              </li>
            ))}
          </ul>

          {project.story.gallery.map((img) => (
            <figure key={img.src} className="mt-12">
              <div className="border border-brass/25 bg-lacquer-deep p-2 sm:p-3">
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full" />
              </div>
              <figcaption className="mt-3 text-xs text-moss">{img.alt}</figcaption>
            </figure>
          ))}

          <h3 className="display mt-12 text-2xl">Where it stands</h3>
          <p className="mt-4 max-w-[62ch] text-base">{project.outcome}</p>

          <h3 className="display mt-12 text-2xl">Built with</h3>
          <p className="mt-4 text-base">{project.stack.join(", ")}</p>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="mt-12 inline-flex h-11 items-center gap-2 rounded-full bg-gilt px-6 text-sm text-lacquer transition-colors hover:bg-bone"
            >
              Visit {project.urlLabel}
              <ExternalGlyph />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Client websites: a quiet list, with a live preview trailing the pointer on desktop.
function ClientSites() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [hover, setHover] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26 });
  const sy = useSpring(y, { stiffness: 220, damping: 26 });

  return (
    <div
      id="clients"
      className="relative mt-24 md:mt-32"
      onPointerMove={(e) => {
        x.set(e.clientX + 28);
        y.set(e.clientY - 110);
      }}
    >
      <div className="grid gap-4 lg:grid-cols-12">
        <h3 className="display text-3xl md:text-4xl lg:col-span-6">
          Websites for local businesses
        </h3>
        <p className="max-w-[52ch] text-sm text-moss lg:col-span-5 lg:col-start-8 lg:self-end">
          Sites I&rsquo;ve built for South Florida businesses, from family restaurants to marine
          suppliers. All of them are live.
        </p>
      </div>
      <ul className="mt-8 border-b border-bone/10">
        {clientSites.map((site) => (
          <li key={site.name} className="border-t border-bone/10">
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit"
              onPointerEnter={() => setHover(site)}
              onPointerLeave={() => setHover(null)}
              className="group grid grid-cols-12 items-center gap-x-4 gap-y-2 py-5 md:py-6"
            >
              <img
                src={site.image}
                alt=""
                loading="lazy"
                className="col-span-4 row-span-3 aspect-[16/10] w-full border border-brass/25 object-cover object-top md:hidden"
              />
              <span className="col-span-8 md:col-span-4">
                <span className="display block text-xl text-bone transition-transform duration-500 group-hover:translate-x-1.5 md:text-2xl">
                  {site.name}
                </span>
                <span className="mt-1 block text-2xs text-moss md:text-xs">{site.kind}</span>
              </span>
              <span className="col-span-8 text-sm md:col-span-5">{site.note}</span>
              <span className="col-span-8 inline-flex items-center gap-1.5 text-xs text-brass md:col-span-3 md:justify-end">
                {site.urlLabel}
                <ExternalGlyph />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-moss">
        Need a website for your business?{" "}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            goTo("contact");
          }}
          className="thread-link text-gilt"
        >
          Let&rsquo;s talk about it
        </a>
        .
      </p>

      {fine && (
        <AnimatePresence>
          {hover && (
            <motion.div
              key="preview"
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-40 w-80 border border-brass/30 bg-lacquer-deep p-1.5"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <img
                src={hover.image}
                alt=""
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative pt-14 md:pt-24">
      <div className="frame">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2
            id="projects-title"
            className="display text-[clamp(3rem,8.4vw,8rem)] leading-[0.9] tracking-[-0.03em] lg:col-span-7"
          >
            Built on my own time.
          </h2>
          <p className="max-w-[46ch] self-end text-base md:text-lg lg:col-span-4 lg:col-start-9">
            Products and sites I&rsquo;ve designed, built and shipped outside the day job, for
            startups, nonprofits and small businesses.
          </p>
        </div>

        <div className="mt-14 md:mt-20">
          {projects.map((p) => (
            <Feature key={p.id} project={p} onOpen={setOpen} />
          ))}
        </div>

        <ClientSites />
      </div>

      <AnimatePresence>{open && <CaseStudy project={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}
