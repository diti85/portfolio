import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { createPipelineSim } from "./pipeline/sim";
import { useVisibility } from "../lib/useInView";
import { pipelineSteps } from "../data/content";
import { ChapterMark } from "./SectionHead";

const NUMERALS = ["I", "II", "III", "IV"];
const fmt = new Intl.NumberFormat("en-US");

function Readout({ label, value, emphasized, warn }) {
  return (
    <div
      className={`flex flex-col gap-1 border-t pt-3 transition-colors duration-500 ${
        emphasized ? "border-brass/70" : "border-bone/10"
      }`}
    >
      <dt className="text-2xs text-moss">{label}</dt>
      <dd
        className={`display figures text-xl transition-colors duration-500 sm:text-2xl ${
          warn ? "text-warn" : emphasized ? "text-bone" : "text-bone/60"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function Pipeline() {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const stepRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [r, setR] = useState(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const sim = createPipelineSim(canvas, { reducedMotion: !!reduced, onReadout: setR });
    if (!sim) return undefined;
    simRef.current = sim;
    const ro = new ResizeObserver(() => sim.resize());
    ro.observe(canvas);
    // Canvas text uses the web font; redraw once it has loaded.
    document.fonts?.ready.then(() => sim.resize());
    return () => {
      ro.disconnect();
      sim.destroy();
      simRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    simRef.current?.setMode(active);
  }, [active]);

  const onVisible = useCallback((visible) => {
    const sim = simRef.current;
    if (!sim) return;
    if (visible) sim.start();
    else sim.stop();
  }, []);
  useVisibility(canvasRef, onVisible);

  // The step crossing the middle of the viewport drives the model.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number(e.target.dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const key = pipelineSteps[active].readout;

  return (
    <section id="ingestion" aria-labelledby="ingestion-title" className="relative pt-24 md:pt-36">
      <div className="frame">
        <ChapterMark numeral="I" name="Ingestion" />
        <h3
          id="ingestion-title"
          className="display mt-4 max-w-[12ch] text-[clamp(3rem,8.4vw,8rem)] leading-[0.9] tracking-[-0.03em]"
        >
          Thirty million messages a day.
        </h3>
        <p className="mt-8 max-w-[58ch] text-base md:mt-10 md:text-lg">
          I architected the ingestion service that carries data from 33 enterprise sources into the
          stores the company&rsquo;s analytics are built on. Below is a working model of how it
          keeps up. Scroll to step through it.
        </p>
      </div>

      <div className="frame mt-12 grid gap-x-12 md:mt-20 lg:grid-cols-12">
        {/* The model stays pinned while the steps scroll past it. */}
        <div className="sticky top-16 z-10 -mx-[clamp(1rem,4.5vw,4rem)] bg-lacquer px-[clamp(1rem,4.5vw,4rem)] pb-4 pt-4 lg:order-2 lg:col-span-7 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pt-8">
          <div className="relative aspect-[5/3.4] w-full lg:aspect-[5/4]">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Animated model: thirty-three sources send messages over Service Bus into the ingestion service, which batches them and delivers each batch to Cosmos DB and Snowflake."
            />
          </div>
          <dl className="mt-3 grid grid-cols-4 gap-3 sm:gap-5">
            <Readout
              label="Intake, msg/s"
              value={r ? fmt.format(r.intake) : "—"}
              emphasized={key === "sources"}
              warn={r?.paused}
            />
            <Readout label="Batch size" value={r ? r.batch : "—"} emphasized={key === "batch"} />
            <Readout
              label="Concurrency"
              value={r ? `${r.concurrency}/${r.maxConcurrency}` : "—"}
              emphasized={key === "concurrency"}
              warn={r && r.concurrency < r.maxConcurrency}
            />
            <Readout
              label="Delivered"
              value={r ? fmt.format(r.delivered) : "—"}
              emphasized={key === "delivered"}
            />
          </dl>
          <p className="mt-3 text-2xs text-moss">
            A model of the design. Readouts are simulated, not production numbers.
          </p>
        </div>

        <ol className="relative lg:order-1 lg:col-span-5">
          {pipelineSteps.map((s, i) => (
            <li key={s.title} className="flex min-h-[62vh] items-center py-10 lg:min-h-[88vh]">
              <div
                ref={(el) => (stepRefs.current[i] = el)}
                data-step={i}
                className={`border-l pl-6 transition-[border-color,opacity] duration-700 md:pl-8 ${
                  active === i ? "border-brass opacity-100" : "border-bone/10 opacity-40"
                }`}
              >
                <p className="display text-lg italic text-brass" aria-hidden="true">
                  {NUMERALS[i]}
                </p>
                <h4 className="display mt-3 text-3xl md:text-4xl">{s.title}</h4>
                <p className="mt-5 max-w-[40ch] text-base">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
