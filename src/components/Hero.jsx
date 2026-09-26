import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import LoomCanvas from "./loom/LoomCanvas";
import { profile, MESSAGES_PER_DAY } from "../data/content";

const EASE = [0.22, 1, 0.36, 1];

// Each letter rises out of its own mask; the one choreographed moment on the page.
function Name({ reduced }) {
  const words = profile.name.split(" ");
  let index = 0;
  return (
    <h1
      aria-label={profile.name}
      className="display text-[clamp(4.25rem,15.5vw,14rem)] leading-[0.84] tracking-[-0.035em]"
    >
      {words.map((word) => (
        <span key={word} aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
          {[...word].map((ch) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                initial={reduced ? false : { y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.35 + i * 0.045, ease: EASE }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

// Messages that would have passed through the ingestion service since the
// visitor arrived, at the documented 30M+/day average. Written straight to the
// DOM so the page doesn't re-render ten times a second.
function Counter() {
  const ref = useRef(null);
  useEffect(() => {
    const perMs = MESSAGES_PER_DAY / 86_400_000;
    const began = performance.now();
    const fmt = new Intl.NumberFormat("en-US");
    const id = setInterval(() => {
      if (ref.current)
        ref.current.textContent = fmt.format(Math.floor((performance.now() - began) * perMs));
    }, 90);
    return () => clearInterval(id);
  }, []);
  return (
    <span ref={ref} className="figures">
      0
    </span>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const fade = (delay) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE },
        };

  return (
    <section
      id="top"
      className="relative isolate flex h-[100svh] min-h-[640px] flex-col overflow-hidden"
      style={{ "--hub-x": "68%", "--hub-y": "42%" }}
    >
      {/* warm light pooled around the hub, and a floor so the type reads */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at var(--hub-x) var(--hub-y), rgba(235,210,159,0.10), transparent 32%), radial-gradient(ellipse 120% 90% at 50% 35%, transparent 45%, rgba(7,19,16,0.75))",
        }}
      />
      <LoomCanvas />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-lacquer via-lacquer/70 to-transparent"
      />

      <div className="frame relative mt-auto pb-[clamp(1.75rem,6vh,4.5rem)]">
        <Name reduced={reduced} />

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
          <motion.p
            {...fade(1.25)}
            className="max-w-[34ch] text-lg leading-snug text-bone/90 md:col-span-5 md:text-xl"
          >
            I build data platforms that move millions of records a day, and the tools that say, in
            real time, when something breaks.
          </motion.p>

          <motion.dl {...fade(1.4)} className="grid gap-3 text-xs md:col-span-3 md:col-start-7">
            <div>
              <dt className="sr-only">Role</dt>
              <dd className="text-bone">{profile.role}</dd>
              <dd>{profile.team}</dd>
            </div>
            <div>
              <dt className="sr-only">Study</dt>
              <dd>{profile.study}</dd>
            </div>
          </motion.dl>

          <motion.p {...fade(1.55)} className="text-xs md:col-span-3 md:col-start-10 md:text-right">
            <span className="display block text-2xl text-gilt md:text-3xl">
              <Counter />
            </span>
            messages have passed through the ingestion service I built since you arrived, at its
            average rate.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
