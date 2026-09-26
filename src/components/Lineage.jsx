import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { lineage, workChapters } from "../data/content";
import { useMediaQuery } from "../lib/useInView";
import { ChapterMark, ProblemSolution } from "./SectionHead";

const chapter = workChapters[1];

const EASE = [0.22, 1, 0.36, 1];
const STEP_MS = 320; // how long the failure takes to travel one hop downstream

// Desktop flows left → right; phones flow top → bottom.
const WIDE = { w: 1000, h: 500, along: [90, 370, 640, 910], across: [90, 210, 330, 450] };
const TALL = { w: 360, h: 640, along: [70, 245, 420, 595], across: [45, 135, 225, 315] };

function place(node, byLayer, g, wide) {
  const index = byLayer[node.layer].indexOf(node);
  const a = g.along[node.layer];
  const c = g.across[index];
  return wide ? { x: a, y: c } : { x: c, y: a };
}

function pathFor(p, q, wide) {
  if (wide) {
    const mx = (p.x + q.x) / 2;
    return `M${p.x} ${p.y} C${mx} ${p.y} ${mx} ${q.y} ${q.x} ${q.y}`;
  }
  const my = (p.y + q.y) / 2;
  return `M${p.x} ${p.y} C${p.x} ${my} ${q.x} ${my} ${q.x} ${q.y}`;
}

// Breadth-first walk downstream from the failed node: id → hops away.
function impactOf(failed) {
  if (!failed) return new Map();
  const depth = new Map([[failed, 0]]);
  const queue = [failed];
  while (queue.length) {
    const id = queue.shift();
    for (const [from, to] of lineage.edges) {
      if (from === id && !depth.has(to)) {
        depth.set(to, depth.get(id) + 1);
        queue.push(to);
      }
    }
  }
  return depth;
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export default function Lineage() {
  const wide = useMediaQuery("(min-width: 640px)");
  const g = wide ? WIDE : TALL;
  const [failed, setFailed] = useState(null);

  const byLayer = useMemo(() => {
    const layers = [[], [], [], []];
    lineage.nodes.forEach((n) => layers[n.layer].push(n));
    return layers;
  }, []);

  const pos = useMemo(() => {
    const m = new Map();
    lineage.nodes.forEach((n) => m.set(n.id, place(n, byLayer, g, wide)));
    return m;
  }, [byLayer, g, wide]);

  const impact = useMemo(() => impactOf(failed), [failed]);
  const byId = useMemo(() => new Map(lineage.nodes.map((n) => [n.id, n])), []);

  const impacted = [...impact.keys()].filter((id) => id !== failed).map((id) => byId.get(id));
  const counts = [1, 2, 3].map((layer) => impacted.filter((n) => n.layer === layer).length);
  const reports = impacted.filter((n) => n.layer === 3);
  const root = failed ? byId.get(failed) : null;

  const toggle = (id) => setFailed((cur) => (cur === id ? null : id));

  const statusOf = (id) => {
    if (id === failed) return "failed";
    if (impact.has(id)) return "impacted";
    return "healthy";
  };

  return (
    <section
      id="observability"
      aria-labelledby="lineage-title"
      className="relative pb-10 pt-24 md:pt-36"
    >
      <div className="frame grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ChapterMark numeral="II" name="Observability" />
          <h3
            id="lineage-title"
            className="display mt-4 text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.95] tracking-[-0.025em]"
          >
            When something breaks, know what it breaks.
          </h3>
        </div>
        <div className="flex flex-col justify-end gap-4 lg:col-span-6 lg:col-start-7">
          <ProblemSolution problem={chapter.problem} solution={chapter.solution} />
          <p className="text-sm text-moss">
            Try it: select any node to break it. The names are made up; the mechanics are the real
            idea.
          </p>
        </div>
      </div>

      <div className="frame mt-12 md:mt-16">
        <div
          className="relative mx-auto w-full"
          style={{ aspectRatio: `${g.w} / ${g.h}`, maxWidth: wide ? 1120 : 420 }}
        >
          <svg
            viewBox={`0 0 ${g.w} ${g.h}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {/* health-check sweep */}
            {!failed && (
              <line
                x1="0"
                y1="0"
                x2={wide ? 0 : g.w}
                y2={wide ? g.h : 0}
                className={wide ? "sweep-x" : "sweep-y"}
                stroke="var(--color-brass)"
                strokeOpacity="0.25"
                strokeWidth="1"
              />
            )}
            {lineage.edges.map(([from, to]) => {
              const p = pos.get(from);
              const q = pos.get(to);
              const d = pathFor(p, q, wide);
              const hit = impact.has(from) && impact.has(to);
              const delay = hit ? impact.get(from) * STEP_MS : 0;
              return (
                <g key={`${from}-${to}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke="var(--color-bone)"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                  />
                  {!hit && <path d={d} fill="none" className="edge-flow" strokeWidth="1" />}
                  {hit && (
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={from === failed ? "var(--color-fail)" : "var(--color-warn)"}
                      strokeWidth="1.25"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: STEP_MS / 1000, delay: delay / 1000, ease: "linear" }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* layer names */}
          {lineage.layers.map((name, layer) => {
            const a = g.along[layer];
            const style = wide
              ? { left: `${(a / g.w) * 100}%`, top: 0, transform: "translateX(-50%)" }
              : { left: 0, top: `${((a - 40) / g.h) * 100}%` };
            return (
              <p key={name} className="absolute text-2xs text-moss" style={style}>
                {name}
              </p>
            );
          })}

          {lineage.nodes.map((n) => {
            const p = pos.get(n.id);
            const status = statusOf(n.id);
            const hops = impact.get(n.id) ?? 0;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => toggle(n.id)}
                aria-pressed={n.id === failed}
                aria-label={`${n.label}, ${lineage.layers[n.layer].toLowerCase()}: ${status}. ${
                  n.id === failed ? "Select to restore." : "Select to break it."
                }`}
                data-cursor={n.id === failed ? "Restore" : "Break"}
                className="group absolute flex -translate-x-1/2 flex-col items-center gap-2 p-2 outline-offset-0"
                style={{ left: `${(p.x / g.w) * 100}%`, top: `calc(${(p.y / g.h) * 100}% - 16px)` }}
              >
                <span className="relative grid size-4 place-items-center">
                  <motion.span
                    className="absolute inset-0 rounded-full border"
                    animate={{
                      borderColor:
                        status === "failed"
                          ? "var(--color-fail)"
                          : status === "impacted"
                            ? "var(--color-warn)"
                            : "rgba(200,165,106,0.7)",
                      scale: status === "healthy" ? 1 : 1.25,
                    }}
                    transition={{
                      delay: status === "impacted" ? (hops * STEP_MS) / 1000 : 0,
                      duration: 0.3,
                    }}
                  />
                  <motion.span
                    className="size-1.5 rounded-full"
                    animate={{
                      backgroundColor:
                        status === "failed"
                          ? "var(--color-fail)"
                          : status === "impacted"
                            ? "var(--color-warn)"
                            : "var(--color-gilt)",
                    }}
                    transition={{
                      delay: status === "impacted" ? (hops * STEP_MS) / 1000 : 0,
                      duration: 0.3,
                    }}
                  />
                  {status === "failed" && (
                    <span className="absolute inset-0 animate-ping rounded-full border border-fail/60" />
                  )}
                </span>
                <span
                  className={`w-max max-w-[5.25rem] text-center text-2xs leading-tight transition-colors sm:max-w-[9rem] sm:text-xs ${
                    status === "healthy" ? "text-sage group-hover:text-bone" : "text-bone"
                  }`}
                >
                  {n.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Health engine verdict */}
        <div
          className="mx-auto mt-10 grid max-w-5xl gap-6 border-t border-bone/10 pt-6 md:grid-cols-12"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            {root ? (
              <motion.div
                key={failed}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid gap-6 md:col-span-10 md:grid-cols-10"
              >
                <div className="md:col-span-3">
                  <p className="text-2xs text-moss">Root cause</p>
                  <p className="display mt-1 text-2xl text-fail">{root.label}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-2xs text-moss">Downstream impact</p>
                  <p className="mt-1.5 text-sm text-bone">
                    {impacted.length === 0
                      ? "Nothing downstream"
                      : [
                          counts[0] && plural(counts[0], "pipeline", "pipelines"),
                          counts[1] && plural(counts[1], "data product", "data products"),
                          counts[2] && plural(counts[2], "report", "reports"),
                        ]
                          .filter(Boolean)
                          .join(", ")}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-2xs text-moss">Reports flagged as stale</p>
                  <p className="mt-1.5 text-sm text-warn">
                    {reports.length ? reports.map((n) => n.label).join(", ") : "None"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="healthy"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center gap-3 md:col-span-10"
              >
                <span className="size-1.5 rounded-full bg-ok" />
                <p className="text-sm text-bone">
                  All {lineage.nodes.length} checks passing.{" "}
                  <span className="text-moss">Select a node to inject a failure.</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex md:col-span-2 md:justify-end">
            <button
              type="button"
              onClick={() => setFailed(null)}
              disabled={!failed}
              className="h-9 rounded-full border border-bone/15 px-4 text-xs text-bone transition-colors enabled:hover:border-brass/60 disabled:opacity-30"
            >
              Restore all
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
