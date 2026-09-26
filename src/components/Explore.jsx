import SectionHead from "./SectionHead";
import { projects, sheets } from "../data/content";
import { useSheet } from "../lib/sheets";

// Little living previews of what's inside each panel. Decorative only.
function WorkTeaser() {
  const sources = Array.from({ length: 11 }, (_, i) => 18 + i * 16.4);
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden="true">
      {sources.map((y, i) => (
        <path
          key={i}
          d={`M0 ${y} C 120 ${y}, 170 100, 250 100`}
          stroke="var(--color-brass)"
          strokeOpacity="0.45"
          strokeWidth="0.8"
          className="teaser-flow"
          style={{ animationDelay: `${-i * 0.37}s` }}
        />
      ))}
      <path
        d="M250 100 C 300 100, 330 40, 400 34"
        stroke="var(--color-gilt)"
        strokeOpacity="0.6"
        strokeWidth="0.9"
      />
      <path
        d="M250 100 C 300 100, 330 160, 400 168"
        stroke="var(--color-gilt)"
        strokeOpacity="0.6"
        strokeWidth="0.9"
      />
      <circle cx="250" cy="100" r="3.5" fill="var(--color-gilt)" />
      <circle
        cx="250"
        cy="100"
        r="11"
        stroke="var(--color-gilt)"
        strokeOpacity="0.5"
        className="teaser-pulse"
      />
    </svg>
  );
}

function ExperienceTeaser() {
  const rows = [
    { y: 44, x1: 60, x2: 230, open: false },
    { y: 84, x1: 0, x2: 200, open: false },
    { y: 124, x1: 236, x2: 340, open: true },
    { y: 164, x1: 300, x2: 390, open: true },
  ];
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" fill="none" aria-hidden="true">
      <line
        x1="340"
        y1="18"
        x2="340"
        y2="190"
        stroke="var(--color-gilt)"
        strokeOpacity="0.35"
        strokeDasharray="2 4"
      />
      {rows.map((r) => (
        <g key={r.y}>
          <line
            x1={r.x1}
            y1={r.y}
            x2={r.x2}
            y2={r.y}
            stroke="var(--color-brass)"
            strokeOpacity="0.7"
            strokeWidth="1"
            className="teaser-draw"
            pathLength="1"
          />
          <circle
            cx={r.x1}
            cy={r.y}
            r="3"
            fill="var(--color-lacquer)"
            stroke="var(--color-brass)"
          />
          <circle
            cx={r.x2}
            cy={r.y}
            r="3"
            fill={r.open ? "var(--color-gilt)" : "var(--color-brass)"}
          />
        </g>
      ))}
      <rect
        x="296"
        y="120"
        width="8"
        height="8"
        transform="rotate(45 300 124)"
        fill="var(--color-lacquer)"
        stroke="var(--color-gilt)"
      />
    </svg>
  );
}

function ProjectsTeaser() {
  const shots = ["aip", "oneams", "sunrise"].map((id) => projects.find((p) => p.id === id));
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      {shots.map((p, i) => (
        <img
          key={p.id}
          src={p.image}
          alt=""
          loading="lazy"
          className={`teaser-card teaser-card-${i} absolute left-1/2 top-1/2 aspect-[16/10] w-[62%] border border-brass/30 object-cover object-top shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]`}
        />
      ))}
    </div>
  );
}

const TEASERS = { work: WorkTeaser, experience: ExperienceTeaser, projects: ProjectsTeaser };

function Panel({ sheet }) {
  const { goTo, registerPanel } = useSheet();
  const Teaser = TEASERS[sheet.id];
  return (
    <article
      ref={(el) => registerPanel(sheet.id, el)}
      className="group relative flex flex-col justify-between overflow-hidden border border-bone/10 bg-felt/40 p-6 transition-[flex-grow,border-color,background-color] duration-700 ease-[var(--ease-silk)] focus-within:border-brass/60 hover:border-brass/50 hover:bg-felt/70 md:p-8 lg:min-h-0 lg:flex-1 lg:hover:flex-[1.6]"
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <p className="text-xs text-moss">{sheet.kicker}</p>
        <span
          className="grid size-10 shrink-0 place-items-center rounded-full border border-brass/40 text-gilt transition-[transform,background-color,color] duration-700 ease-[var(--ease-silk)] group-hover:rotate-90 group-hover:bg-gilt group-hover:text-lacquer"
          aria-hidden="true"
        >
          <svg viewBox="0 0 12 12" className="size-3">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
      </div>

      <div className="pointer-events-none relative my-8 h-36 opacity-80 transition-opacity duration-700 group-hover:opacity-100 sm:h-44 lg:absolute lg:inset-x-8 lg:top-[16%] lg:my-0 lg:h-[38%] lg:opacity-70">
        <Teaser />
      </div>

      <div className="relative z-10">
        <h3 className="display text-4xl leading-none md:text-5xl lg:text-[clamp(2.25rem,3.2vw,3.25rem)]">
          {/* the button's ::after stretches over the whole panel */}
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={(e) => goTo(sheet.id, e.currentTarget.closest("article"))}
            data-cursor="Open"
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {sheet.title}
          </button>
        </h3>
        <p className="mt-4 max-w-[36ch] text-sm">{sheet.summary}</p>
        <p className="mt-5 text-xs text-gilt">{sheet.contents}</p>
      </div>
    </article>
  );
}

// The fork in the road: instead of one long scroll, visitors open the part
// they came for. Each panel grows into a full-screen sheet.
export default function Explore() {
  return (
    <section id="explore" aria-labelledby="explore-title" className="relative pt-24 md:pt-36">
      <SectionHead label="Explore" note="Open a section to see it in full" />
      <div className="frame mt-12 md:mt-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2
            id="explore-title"
            className="display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.025em] lg:col-span-7"
          >
            Go straight to what you came for.
          </h2>
          <p className="max-w-[44ch] self-end text-base md:text-lg lg:col-span-4 lg:col-start-9">
            Each section opens on its own. Close it and you&rsquo;re right back here.
          </p>
        </div>
        <div className="mt-12 flex flex-col gap-3 md:mt-16 lg:h-[min(70vh,640px)] lg:flex-row">
          {sheets.map((s) => (
            <Panel key={s.id} sheet={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
