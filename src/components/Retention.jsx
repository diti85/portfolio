import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { createRetentionSim } from "./retention/sim";
import { ChapterMark, ProblemSolution } from "./SectionHead";
import { workChapters } from "../data/content";
import { useVisibility } from "../lib/useInView";

const chapter = workChapters[2];

const fmt = new Intl.NumberFormat("en-US");

const LEGEND = [
  { label: "Short policy", className: "bg-gilt" },
  { label: "Medium policy", className: "bg-brass" },
  { label: "Long policy", className: "bg-bone" },
  { label: "Past its window", className: "bg-warn" },
];

export default function Retention() {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const [r, setR] = useState(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const sim = createRetentionSim(canvas, { reducedMotion: !!reduced, onReadout: setR });
    if (!sim) return undefined;
    simRef.current = sim;
    const ro = new ResizeObserver(() => sim.resize());
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      sim.destroy();
      simRef.current = null;
    };
  }, [reduced]);

  const onVisible = useCallback((visible) => {
    const sim = simRef.current;
    if (!sim) return;
    if (visible) sim.start();
    else sim.stop();
  }, []);
  useVisibility(canvasRef, onVisible);

  return (
    <section id="retention" aria-labelledby="retention-title" className="relative pt-24 md:pt-36">
      <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <ChapterMark numeral="III" name="Retention" />
          <h3
            id="retention-title"
            className="display mt-4 text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.95] tracking-[-0.025em]"
          >
            Deleted on schedule.
          </h3>
          <ProblemSolution problem={chapter.problem} solution={chapter.solution} className="mt-8" />
          <dl className="mt-10 grid grid-cols-2 gap-6">
            <div className="border-t border-brass/30 pt-3">
              <dd className="display figures text-4xl text-bone md:text-5xl">75%</dd>
              <dt className="mt-1 text-xs text-moss">less audit risk</dt>
            </div>
            <div className="border-t border-brass/30 pt-3">
              <dd className="display figures text-4xl text-bone md:text-5xl">40%</dd>
              <dt className="mt-1 text-xs text-moss">lower projected storage costs</dt>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7 lg:self-center">
          <div className="relative aspect-[3/2] w-full sm:aspect-[12/5]">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Animated model: records age toward their retention windows, and a scheduled deletion run sweeps across the store removing the ones that are due."
            />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-5">
            {[
              ["Records held", r ? fmt.format(r.held) : "—", false],
              ["Past their window", r ? r.due : "—", r && r.due > 0],
              ["Deleted on schedule", r ? fmt.format(r.deleted) : "—", false],
            ].map(([label, value, warn]) => (
              <div key={label} className="flex flex-col gap-1 border-t border-bone/10 pt-3">
                <dt className="text-2xs text-moss">{label}</dt>
                <dd
                  className={`display figures text-xl transition-colors duration-500 sm:text-2xl ${
                    warn ? "text-warn" : "text-bone"
                  }`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-2xs text-moss">
            {LEGEND.map((l) => (
              <li key={l.label} className="flex items-center gap-2">
                <span className={`size-1.5 rounded-full ${l.className}`} aria-hidden="true" />
                {l.label}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-2xs text-moss">
            A model of the design. Policies and counts are simulated.
          </p>
        </div>
      </div>
    </section>
  );
}
