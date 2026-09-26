import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { capabilities, credentials, profile, timeline } from "../data/content";
import SectionHead from "./SectionHead";
import { useMediaQuery } from "../lib/useInView";

const EASE = [0.22, 1, 0.36, 1];
const FROM = 2020;
const TO = 2028;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const now = new Date();
const TODAY = [now.getFullYear(), now.getMonth() + 1];

const frac = ([y, m]) => (y + (m - 1) / 12 - FROM) / (TO - FROM);
const pct = (f) => `${(Math.min(1, Math.max(0, f)) * 100).toFixed(3)}%`;
const fmtDate = (d) => (d ? `${MONTHS[d[1] - 1]} ${d[0]}` : null);

function dates(item) {
  const end = item.end ? fmtDate(item.end) : "Present";
  if (!item.start) return `Graduated ${end}`;
  return `${fmtDate(item.start)} – ${item.expected ? `expected ${end}` : end}`;
}

function Thread({ item, index, selected, onSelect, drawn, reduced, wide }) {
  const start = item.start ? frac(item.start) : 0;
  const todayF = frac(TODAY);
  const endF = item.end ? frac(item.end) : todayF;
  const solidEnd = item.expected ? Math.min(endF, todayF) : endF;
  const ongoing = !item.end || (item.expected && endF > todayF);
  // Labels for threads that start late hang from the thread's end instead.
  const anchorRight = start > (wide ? 0.55 : 0.45);
  const dim = !selected;

  const grow = (delay) =>
    reduced
      ? {}
      : {
          initial: { scaleX: 0 },
          animate: drawn ? { scaleX: 1 } : { scaleX: 0 },
          transition: { duration: 1.3, delay, ease: EASE },
        };

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group relative block h-[76px] w-full text-left sm:h-[84px]"
    >
      <span
        className={`absolute top-2 z-10 flex flex-col bg-lacquer py-0.5 transition-opacity duration-500 ${anchorRight ? "items-end pl-2 text-right" : "pr-2"} ${
          dim ? "opacity-55 group-hover:opacity-90" : "opacity-100"
        }`}
        style={anchorRight ? { right: `calc(100% - ${pct(endF)})` } : { left: pct(start) }}
      >
        <span className="whitespace-nowrap text-sm text-bone">{item.org}</span>
        <span className="whitespace-nowrap text-2xs text-moss sm:text-xs">{item.title}</span>
      </span>

      {/* the thread */}
      <span className="absolute inset-x-0 bottom-5 h-px">
        {!item.start && (
          <motion.span
            className="absolute inset-y-0 origin-left bg-gradient-to-r from-transparent to-brass"
            style={{ left: 0, width: pct(endF) }}
            {...grow(index * 0.12)}
          />
        )}
        {item.start && (
          <motion.span
            className={`absolute inset-y-0 origin-left transition-colors duration-500 ${selected ? "bg-gilt" : "bg-brass/60"}`}
            style={{ left: pct(start), width: pct(solidEnd - start) }}
            {...grow(index * 0.12)}
          />
        )}
        {item.expected && endF > todayF && (
          <motion.span
            className="absolute -top-px h-0 origin-left border-t border-dashed border-brass/50"
            style={{ left: pct(todayF), width: pct(endF - todayF) }}
            {...grow(index * 0.12 + 1)}
          />
        )}

        {/* beads */}
        {item.start && (
          <span
            className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass bg-lacquer"
            style={{ left: pct(start) }}
          />
        )}
        {item.knots?.map((k) => (
          <span
            key={k.label}
            title={k.label}
            className="absolute top-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gilt bg-lacquer"
            style={{ left: pct(frac(k.at)) }}
          />
        ))}
        {ongoing ? (
          <span
            className="absolute top-1/2 grid size-3 -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ left: pct(solidEnd) }}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-gilt/40" />
            <span className="size-[7px] rounded-full bg-gilt" />
          </span>
        ) : (
          <span
            className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass"
            style={{ left: pct(endF) }}
          />
        )}
        {item.expected && (
          <span
            className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brass bg-lacquer"
            style={{ left: pct(endF) }}
          />
        )}
      </span>
    </button>
  );
}

export default function Experience() {
  const chartRef = useRef(null);
  const drawn = useInView(chartRef, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const [selectedId, setSelectedId] = useState("geico");
  const selected = timeline.find((t) => t.id === selectedId);
  const years = Array.from({ length: TO - FROM + 1 }, (_, i) => FROM + i);
  const todayF = frac(TODAY);

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative pt-24 md:pt-36">
      <SectionHead label="Experience" note="Roles, education, toolkit and résumé" />
      <div className="frame mt-12 md:mt-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2
            id="experience-title"
            className="display text-[clamp(3rem,8.4vw,8rem)] leading-[0.9] tracking-[-0.03em] lg:col-span-7"
          >
            Experience.
          </h2>
          <p className="max-w-[46ch] self-end text-base md:text-lg lg:col-span-4 lg:col-start-9">
            From client projects at a small studio to the systems behind one of the largest auto
            insurers in the U.S. Select a thread for the details.
          </p>
        </div>

        <div ref={chartRef} className="relative mt-14 md:mt-20">
          {/* today */}
          <div
            className="pointer-events-none absolute inset-y-0 z-0"
            style={{ left: pct(todayF) }}
            aria-hidden="true"
          >
            <span className="absolute -top-6 -translate-x-1/2 text-2xs text-gilt">Today</span>
            <span className="absolute inset-y-0 w-px bg-gradient-to-b from-gilt/60 via-gilt/20 to-transparent" />
          </div>

          <div className="relative z-10">
            {timeline.map((item, i) => (
              <Thread
                key={item.id}
                item={item}
                index={i}
                selected={item.id === selectedId}
                onSelect={() => setSelectedId(item.id)}
                drawn={drawn}
                reduced={reduced}
                wide={wide}
              />
            ))}
          </div>

          {/* axis */}
          <div className="relative mt-2 h-8 border-t border-bone/10" aria-hidden="true">
            {years.map((y, i) => (
              <span
                key={y}
                className={`figures absolute top-2 -translate-x-1/2 text-2xs text-moss ${i % 2 ? "hidden sm:block" : ""} ${
                  i === 0 ? "translate-x-0" : i === years.length - 1 ? "-translate-x-full" : ""
                }`}
                style={{ left: pct((y - FROM) / (TO - FROM)) }}
              >
                {y}
              </span>
            ))}
          </div>
        </div>

        {/* details */}
        <div
          className="mt-12 grid gap-8 border-t border-brass/30 pt-10 lg:grid-cols-12"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid gap-8 lg:col-span-12 lg:grid-cols-12"
            >
              <div className="lg:col-span-4">
                <p className="figures text-xs text-moss">{dates(selected)}</p>
                <h3 className="display mt-3 text-3xl md:text-4xl">{selected.org}</h3>
                <p className="mt-2 text-base text-bone/85">{selected.title}</p>
                <p className="mt-1 text-sm text-moss">{selected.place}</p>
                {selected.knots?.map((k) => (
                  <p key={k.label} className="mt-4 flex items-center gap-2 text-xs text-gilt">
                    <span className="size-2 rotate-45 border border-gilt" aria-hidden="true" />
                    {k.label}, {fmtDate(k.at)}
                  </p>
                ))}
              </div>
              <ul className="flex flex-col gap-4 lg:col-span-7 lg:col-start-6">
                {selected.points.map((p) => (
                  <li key={p} className="relative max-w-[66ch] pl-6 text-base">
                    <span
                      className="absolute left-0 top-[0.8em] h-px w-3 bg-brass"
                      aria-hidden="true"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* toolkit: where technology names belong */}
        <div className="mt-24 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="display text-3xl md:text-4xl">Toolkit</h3>
            <p className="mt-3 max-w-[36ch] text-sm text-moss">
              What I reach for, grouped by where it sits in a system.
            </p>
          </div>
          <dl className="lg:col-span-8">
            {capabilities.map((c) => (
              <div
                key={c.group}
                className="grid gap-1 border-b border-bone/[0.07] py-4 md:grid-cols-[14rem_1fr] md:gap-6"
              >
                <dt className="display text-xl text-bone">{c.group}</dt>
                <dd className="text-sm leading-relaxed md:self-center">{c.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* education and credentials, then the résumé */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="display text-3xl md:text-4xl">Education and credentials</h3>
          </div>
          <div className="lg:col-span-8">
            <dl>
              {credentials.map((c) => (
                <div
                  key={c.name}
                  className="flex items-baseline gap-3 border-b border-bone/[0.07] py-4"
                >
                  <dt className="text-sm text-bone">{c.name}</dt>
                  <span className="leader" aria-hidden="true" />
                  <dd className="text-right text-xs text-moss">{c.detail}</dd>
                </div>
              ))}
            </dl>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex h-11 items-center rounded-full bg-gilt px-6 text-sm text-lacquer transition-colors hover:bg-bone"
            >
              Download the full résumé (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
